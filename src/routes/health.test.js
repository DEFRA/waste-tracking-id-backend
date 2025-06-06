import { createServer } from '../server.js'

describe('Health Endpoint', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /health returns success message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({ message: 'success' })
  })
})
