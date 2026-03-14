const dotenv = require('dotenv');
dotenv.config();
console.log('Environment loaded');

const redis = require('./src/config/redis-config');
console.log('Redis config loaded');

async function clearCache() {
  try {
    console.log('Clearing cache...');
    // Clear all topic-related cache keys
    await redis.del('topic:all');
    console.log('Cleared topic:all');
    await redis.del('tech:all');
    console.log('Cleared tech:all');
    await redis.del('tech:name:Node.Js');
    console.log('Cleared tech:name:Node.Js');
    await redis.del('tech:name:Node.js');
    console.log('Cleared tech:name:Node.js');

    // Get all keys that match patterns and delete them
    const keys = await redis.keys('topic:*');
    console.log(`Found ${keys.length} topic keys`);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log('Deleted topic keys');
    }

    const techKeys = await redis.keys('tech:*');
    console.log(`Found ${techKeys.length} tech keys`);
    if (techKeys.length > 0) {
      await redis.del(techKeys);
      console.log('Deleted tech keys');
    }

    console.log('✅ All topic and tech caches cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  } finally {
    process.exit(0);
  }
}

clearCache();
