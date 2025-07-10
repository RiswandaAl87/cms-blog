class PostDTO {
  constructor(post) {
    this.id = post._id?.toString();         
    this.title = post.title || '';
    this.slug = post.slug || '';            
    this.content = post.content || '';
    this.author = post.author || null;
    this.tags = Array.isArray(post.tags) ? post.tags : [];
    this.image = post.image || null;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}

module.exports = PostDTO;
