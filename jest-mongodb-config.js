export default {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true
    },
    autoStart: false,
    instance: {
      dbName: 'waste-tracking-id-backend',
      replSet: {
        name: 'rs0',
        storageEngine: 'wiredTiger'
      }
    }
  },
  mongoURLEnvName: 'MONGO_URI',
  useSharedDBForAllJestWorkers: false
}
