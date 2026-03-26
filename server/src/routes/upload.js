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

console.log('Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME ? 'yes' : 'MISSING');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|quicktime/;
    const mime = file.mimetype.split('/')[1];
    cb(null, allowed.test(mime));
  }
});

router.post('/', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      console.log('Uploading to Cloudinary:', req.file.originalname, req.file.size, 'bytes');
      const isVideo = req.file.mimetype.startsWith('video/');
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: isVideo ? 'video' : 'image',
            folder: 'forsick'
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      console.log('Upload success:', result.secure_url);
      res.json({
        url: result.secure_url,
        type: isVideo ? 'video' : 'image'
      });
    } catch (err) {
      console.error('Cloudinary error:', err.message || err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
});

module.exports = router;
