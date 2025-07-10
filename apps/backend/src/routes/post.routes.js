const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const upload = require('../middlewares/upload.middleware'); // multer or cloudinary

// CREATE post (with optional image)

router.post('/', upload.single('image'), postController.createPost);

// GET all posts
router.get('/', postController.getAllPosts);

// GET post by ID
router.get('/:id', postController.getPostById);

// UPDATE post (with optional new image)
router.put('/:id', upload.single('image'), postController.updatePost);

// DELETE post
router.delete('/:id', postController.deletePost);

module.exports = router;
