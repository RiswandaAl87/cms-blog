const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.config'); // ✅ Impor instance cloudinary.v2 langsung

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // ✅ Ini harus instance cloudinary.v2
  params: {
    folder: 'posts',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;
