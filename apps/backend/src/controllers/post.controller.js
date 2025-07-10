const PostService = require('../services/post.service');
const PostDTO = require('../dtos/post.dto');

exports.createPost = async (req, res) => {
  try {
    const imageUrl = req.file?.path || null; // Cloudinary URL langsung di `.path`

    const post = await PostService.createPost({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json(new PostDTO(post));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostService.getAllPosts();
    res.json(posts.map(post => new PostDTO(post)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await PostService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(new PostDTO(post));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const imageUrl = req.file?.path || undefined;
    const updatedData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    };

    const updatedPost = await PostService.updatePost(req.params.id, updatedData);
    res.json(new PostDTO(updatedPost));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    await PostService.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
