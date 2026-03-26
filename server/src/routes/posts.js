const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get feed (posts from people you follow + your own)
router.get('/feed', auth, async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true }
    });
    const ids = [req.userId, ...following.map(f => f.followingId)];

    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { comments: true, likes: true } },
        likes: { where: { userId: req.userId }, select: { id: true } }
      }
    });

    const formatted = posts.map(post => ({
      ...post,
      likedByMe: post.likes.length > 0,
      likes: undefined
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Get all posts (explore)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, username: true, name: true, avatar: true } } }
        },
        _count: { select: { comments: true, likes: true } }
      }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = await prisma.post.create({
      data: { content, image, authorId: req.userId },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });

    req.app.get('io').emit('newPost', post);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

    await prisma.post.delete({ where: { id: post.id } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like / Unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: req.userId, postId } }
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId: req.userId, postId } });
      req.app.get('io').emit('postLiked', { postId, userId: req.userId });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

module.exports = router;
