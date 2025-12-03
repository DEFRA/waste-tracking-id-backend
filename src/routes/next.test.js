import { createServer } from '../server.js'
import { config } from '../config.js'

describe('Next Endpoint', () => {
  let server
  const validToken = config.get('serviceAuthToken')
  const validAuthHeader = `Basic ${Buffer.from(`service:${validToken}`).toString('base64')}`

  beforeEach(async () => {
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /next returns 401 without auth header', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/next'
    })

    expect(response.statusCode).toBe(401)
  })

  test('GET /next returns 401 with invalid token', async () => {
    const invalidAuthHeader = `Basic ${Buffer.from('service:invalid-token').toString('base64')}`
    const response = await server.inject({
      method: 'GET',
      url: '/next',
      headers: {
        authorization: invalidAuthHeader
      }
    })

    expect(response.statusCode).toBe(401)
  })

  test('GET /next returns waste tracking ID with valid auth', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/next',
      headers: {
        authorization: validAuthHeader
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.result).toHaveProperty('wasteTrackingId')

    // Verify the format of the waste tracking ID (YY followed by 6 alphanumeric characters)
    const currentYear = new Date().getFullYear().toString().slice(-2)
    expect(response.result.wasteTrackingId).toMatch(
      new RegExp(`^${currentYear}[A-Z0-9]{6}$`)
    )
  })
})
