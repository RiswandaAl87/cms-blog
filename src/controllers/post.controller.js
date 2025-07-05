const PostService = require('../services/post.service');
const PostDTO = require('../dtos/post.dto');

exports.getAllPosts = async (req, res) => {
  const posts = await PostService.getAllPosts();
  res.json(posts.map(post => new PostDTO(post)));
};

exports.getPostById = async (req, res) => {
  const post = await PostService.getPostById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(new PostDTO(post));
};

exports.createPost = async (req, res) => {
  const post = await PostService.createPost(req.body);
  res.status(201).json(new PostDTO(post));
};

exports.updatePost = async (req, res) => {
  const post = await PostService.updatePost(req.params.id, req.body);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(new PostDTO(post));
};

exports.deletePost = async (req, res) => {
  const post = await PostService.deletePost(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted successfully' });
};
