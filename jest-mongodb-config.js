export default {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.0',
      skipMD5: true
    },
    instance: {
      dbName: 'waste-tracking-id-backend',
      port: 27017
    },
    autoStart: true
  },
  mongoURLEnvName: 'MONGO_URI',
  useSharedDBForAllJestWorkers: false
}
