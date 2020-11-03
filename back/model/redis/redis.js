/**
 * Redis helper functions
 */
const config = require('../../config/dbconfig');
const Redis = require('ioredis');
const redis = new Redis(config.redis);
module.exports = {
  redis: redis,
  doRelease: () => {
    redis.disconnect();
  }
};
