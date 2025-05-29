// Set CDP Mongo URI to URI supplied by @shelf/jest-mongodb
if (!global.__MONGO_URI__) {
  global.__MONGO_URI__ = 'mongodb://localhost:27017/jest'
}
process.env.MONGO_URI = global.__MONGO_URI__
process.env.LOG_ENABLED = false
