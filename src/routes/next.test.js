import { createServer } from '../server.js'

describe('Next Endpoint', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /next returns waste tracking ID', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/next'
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
