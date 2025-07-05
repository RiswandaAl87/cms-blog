class PostDTO {
  constructor({ id, title, content, author, tags, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = PostDTO;
