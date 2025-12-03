import { createServer } from '../server.js'

describe('Next Endpoint', () => {
  let server
  const validClientId = 'test-client-id'
  const validAuthHeader = `Basic ${Buffer.from(`${validClientId}:`).toString('base64')}`

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

  test('GET /next returns 401 with empty clientId', async () => {
    const emptyClientIdHeader = `Basic ${Buffer.from(':').toString('base64')}`
    const response = await server.inject({
      method: 'GET',
      url: '/next',
      headers: {
        authorization: emptyClientIdHeader
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
