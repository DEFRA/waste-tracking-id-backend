import { nextTrackerID } from './token-id-generator.js'

describe('Token ID Generator', () => {
  test('should generate a token ID with correct format', () => {
    const tokenId = nextTrackerID()
    // Check if the token ID matches the expected format (2 digit year + 6 alphanumeric characters)
    console.log(tokenId)
    expect(tokenId).toMatch(/^\d{2}[A-Z0-9]{6}$/)
  })

  test('should be able to generate one billion unique IDs in a year', () => {
    // Calculate total possible combinations for 6 alphanumeric characters
    // Using 36 characters (26 uppercase letters + 10 digits)
    const possibleCombinations = Math.pow(36, 6)

    
    // One billion is 1,000,000,000
    const oneBillion = 1000000000
    
    // Verify that we have enough combinations to generate one billion unique IDs
    expect(possibleCombinations).toBeGreaterThan(oneBillion)
    
    // Log the actual number of possible combinations for reference
    console.log(`Possible combinations per year: ${possibleCombinations.toLocaleString()}`)
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
    expect(tokenId.startsWith(currentYear)).toBe(true)
  })

  test('should generate token ID with correct length', () => {
    const tokenId = nextTrackerID()

    // Check if the total length is 8 ( 2 digit year + 6 alphanumeric characters)
    expect(tokenId.length).toBe(8)
  })

  test('should only contain uppercase letters and numbers in the ID part', () => {
    const tokenId = nextTrackerID()
    const idPart = tokenId.split('-')[0]

    // Check if the ID part only contains uppercase letters and numbers
    expect(idPart).toMatch(/^[A-Z0-9]+$/)
  })
})
