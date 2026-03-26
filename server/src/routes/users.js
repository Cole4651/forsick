const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, username: true, name: true, bio: true, avatar: true,
        _count: { select: { posts: true, followers: true, following: true } }
      }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true, username: true, name: true, bio: true, avatar: true, createdAt: true,
        _count: { select: { posts: true, followers: true, following: true } },
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, username: true, name: true, avatar: true } },
            _count: { select: { comments: true, likes: true } }
          }
        }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, bio, avatar },
      select: { id: true, email: true, username: true, name: true, bio: true, avatar: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Search users
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const users = await prisma.user.findMany({
      where: q ? {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } }
        ]
      } : {},
      select: { id: true, username: true, name: true, avatar: true },
      take: 20
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
