const { Client } = require('@elastic/elasticsearch');
const config = require('../config');

const client = new Client({ node: config.elasticsearch.node });

const connectElasticsearch = async () => {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch Connected...');
    console.log('Cluster health:', health.status);
    
    const indexExists = await client.indices.exists({ index: 'posts' });
    if (!indexExists) {
        await client.indices.create({ index: 'posts' });
        console.log('Index "posts" created.');
    }
  } catch (error) {
    console.error('Elasticsearch connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  client,
  connectElasticsearch,
};