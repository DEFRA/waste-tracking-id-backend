import { nextTrackerID } from '../token-id-generator.js'

describe('Token ID Generator', () => {
  test('should generate a token ID with correct format', () => {
    const tokenId = nextTrackerID()

    // Check if the token ID matches the expected format: 6 alphanumeric characters + hyphen + 2 digit year
    expect(tokenId).toMatch(/^[A-Z0-9]{6}-\d{2}$/)
  })

  test('should generate unique token IDs', () => {
    const tokenId1 = nextTrackerID()
    const tokenId2 = nextTrackerID()

    // Check if two consecutive calls generate different IDs
    expect(tokenId1).not.toBe(tokenId2)
  })

  test('should include current year in the token ID', () => {
    const tokenId = nextTrackerID()
    const currentYear = new Date().getFullYear().toString().slice(-2)

    // Check if the token ID ends with the current year
    expect(tokenId.endsWith(currentYear)).toBe(true)
  })

  test('should generate token ID with correct length', () => {
    const tokenId = nextTrackerID()

    // Check if the total length is 9 (6 characters + hyphen + 2 digit year)
    expect(tokenId.length).toBe(9)
  })

  test('should only contain uppercase letters and numbers in the ID part', () => {
    const tokenId = nextTrackerID()
    const idPart = tokenId.split('-')[0]

    // Check if the ID part only contains uppercase letters and numbers
    expect(idPart).toMatch(/^[A-Z0-9]+$/)
  })
})
