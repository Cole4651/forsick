const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const auth = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|quicktime/;
    const mime = file.mimetype.split('/')[1];
    cb(null, allowed.test(mime));
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const isVideo = req.file.mimetype.startsWith('video/');
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: isVideo ? 'video' : 'image',
          folder: 'forsick',
          transformation: isVideo
            ? [{ quality: 'auto', fetch_format: 'mp4' }]
            : [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      type: isVideo ? 'video' : 'image'
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
