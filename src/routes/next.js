import Joi from 'joi'
import { nextTrackerID } from '../utils/token-id-generator.js'
const next = {
  method: 'GET',
  path: '/next',
  options: {
    description: 'Next route endpoint',
    notes: 'Returns next waste tracking id',
    tags: ['api'],
    validate: {
      query: Joi.object({
        // Add any query parameters here if needed
      })
    },
    handler: async (request, h) => {
      return h.response({
        wasteTrackingId: nextTrackerID()
      })
    }
  }
}

export { next }
