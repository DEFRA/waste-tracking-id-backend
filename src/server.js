import Hapi from '@hapi/hapi'
import Basic from '@hapi/basic'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'

import { config } from './config.js'
import { router } from './plugins/router.js'
import { requestLogger } from './common/helpers/logging/request-logger.js'
import { mongoDb } from './common/helpers/mongodb.js'
import { failAction } from './common/helpers/fail-action.js'
import { secureContext } from './common/helpers/secure-context/index.js'
import { pulse } from './common/helpers/pulse.js'
import { requestTracing } from './common/helpers/request-tracing.js'
import { setupProxy } from './common/helpers/proxy/setup-proxy.js'
import { getEnvVars } from './common/helpers/env-vars.js'

function createAuthValidation(serviceCredentials) {
  serviceCredentials = serviceCredentials || []

  return async (_request, username, password) => {
    const base64EncodedCredentials = btoa(`${username}=${password}`)
    const matchingCredential = serviceCredentials.find(
      (cred) => cred === base64EncodedCredentials
    )

    return { isValid: !!matchingCredential, credentials: { username } }
  }
}

async function createServer() {
  setupProxy()
  const server = Hapi.server({
    host: config.get('host'),
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        },
        failAction
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Swagger configuration
  const swaggerOptions = {
    info: {
      title: 'Waste Tracking ID API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Waste Tracking ID service'
    },
    documentationPath: '/documentation'
  }

  // Register Basic auth and configure strategy
  await server.register(Basic)

  const serviceCredentials = getEnvVars('ACCESS_CRED_')
  server.auth.strategy('service-token', 'basic', {
    validate: createAuthValidation(serviceCredentials)
  })

  server.auth.default('service-token')

  // Hapi Plugins:
  // requestLogger  - automatically logs incoming requests
  // requestTracing - trace header logging and propagation
  // secureContext  - loads CA certificates from environment config
  // pulse          - provides shutdown handlers
  // mongoDb        - sets up mongo connection pool and attaches to `server` and `request` objects
  // router         - routes used in the app
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    requestLogger,
    requestTracing,
    secureContext,
    pulse,
    mongoDb,
    router
  ])

  return server
}

export { createServer, createAuthValidation }
