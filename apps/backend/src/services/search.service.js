const { client } = require('../utils/elasticsearch');

const INDEX_NAME = 'posts';

const indexPost = async (post) => {
  try {
    const populatedPost = await post.populate('author_id', 'username');
    await client.index({
      index: INDEX_NAME,
      id: post._id.toString(),
      body: {
        title: populatedPost.title,
        content: populatedPost.content,
        author_name: populatedPost.author_id.username,
      },
      refresh: true,
    });
  } catch (error) {
    console.error(`Error indexing post ${post._id}:`, error.meta?.body || error);
  }
};

const deletePost = async (post) => {
  try {
    await client.delete({ index: INDEX_NAME, id: post._id.toString() });
  } catch (error) {
    if (error.meta?.statusCode !== 404) console.error(error);
  }
};

const searchPosts = async (query) => {
  const { hits } = await client.search({
    index: INDEX_NAME,
    _source: false,
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title', 'content', 'author_name'],
          fuzziness: 'AUTO',
        },
      },
    },
  });
  return hits.hits.map((hit) => hit._id);
};

module.exports = {
  indexPost,
  deletePost,
  searchPosts,
};