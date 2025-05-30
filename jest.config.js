export default {
  rootDir: '.',
  verbose: true,
  resetModules: true,
  shell: '/usr/local/bin/zsh',
  testEnvironment: 'node',
  clearMocks: true,
  silent: false,
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
  testMatch: ['**/src/**/*.test.js'],
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
  setupFiles: ['<rootDir>/.jest/setup-files.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-files-after-env.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.server',
    'index.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    `node_modules/(?!${[
      '@defra/hapi-tracing', // Supports ESM only
      'node-fetch', // Supports ESM only
      'nanoid' // Supports ESM only
    ].join('|')}/)`
  ]
}
