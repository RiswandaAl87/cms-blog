const Post = require('../models/post.model');

class PostService {
  async createPost(data) {
    const post = new Post(data);
    return await post.save();
  }

  async getAllPosts() {
    return await Post.find().sort({ createdAt: -1 });
  }

  async getPostById(id) {
    return await Post.findById(id);
  }

  async updatePost(id, data) {
    return await Post.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePost(id) {
    return await Post.findByIdAndDelete(id);
  }
}

module.exports = new PostService();
