const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Follow / Unfollow a user
router.post('/:userId', auth, async (req, res) => {
  try {
    const followingId = parseInt(req.params.userId);
    if (followingId === req.userId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.userId, followingId } }
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      res.json({ following: false });
    } else {
      await prisma.follow.create({ data: { followerId: req.userId, followingId } });
      res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
});

// Check if following a user
router.get('/:userId/status', auth, async (req, res) => {
  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: parseInt(req.params.userId)
        }
      }
    });
    res.json({ following: !!follow });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

// Get followers of a user
router.get('/:userId/followers', async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: parseInt(req.params.userId) },
      include: { follower: { select: { id: true, username: true, name: true, avatar: true } } }
    });
    res.json(followers.map(f => f.follower));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get who a user is following
router.get('/:userId/following', async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: parseInt(req.params.userId) },
      include: { following: { select: { id: true, username: true, name: true, avatar: true } } }
    });
    res.json(following.map(f => f.following));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

module.exports = router;
