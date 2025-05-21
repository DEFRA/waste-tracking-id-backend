import { health } from '../routes/health.js'
import { next } from '../routes/next.js'

const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([health].concat(next))
    }
  }
}

export { router }
