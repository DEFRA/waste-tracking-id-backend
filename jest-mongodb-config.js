export default {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true
    },
    autoStart: false,
    instance: {
      dbName: 'waste-tracking-id-backend'
    }
  },
  mongoURLEnvName: 'MONGO_URI',
  useSharedDBForAllJestWorkers: false
}
