const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Add comment to a post
router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);

    const comment = await prisma.comment.create({
      data: { content, authorId: req.userId, postId },
      include: { author: { select: { id: true, username: true, name: true, avatar: true } } }
    });

    req.app.get('io').emit('newComment', { postId, comment });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

    await prisma.comment.delete({ where: { id: comment.id } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
