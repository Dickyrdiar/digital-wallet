const redis = require('redis')

const RedisClient = redis.createClient({
  host: 'localhost',
  port: 6379
})

module.exports = RedisClient
