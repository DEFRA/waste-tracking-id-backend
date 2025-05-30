import { MongoClient } from 'mongodb'
import { nextTrackerID } from './token-id-generator.js'

describe('#token-id-generator', () => {
  let client
  let db

  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__)
    db = client.db('waste-tracking-id-backend')
  })

  afterAll(async () => {
    if (client) {
      await client.close()
    }
  })

  describe('nextTrackerID', () => {
    test('Should generate token ID with correct format', async () => {
      const currentYear = new Date().getFullYear().toString().slice(-2)
      const result = await nextTrackerID({ db })

      expect(result).toMatch(new RegExp(`^${currentYear}[A-Z0-9]{6}$`))
    })

    test('Should reset counter when year changes', async () => {
      // First, set a different year in the database
      await db
        .collection('counters')
        .updateOne(
          { _id: 'tokenId' },
          { $set: { year: 2023, counter: 100 } },
          { upsert: true }
        )

      const currentYear = new Date().getFullYear()
      const result = await nextTrackerID({ db })

      expect(result).toMatch(
        new RegExp(`^${currentYear.toString().slice(-2)}[A-Z0-9]{6}$`)
      )

      // Verify counter was reset
      const counter = await db
        .collection('counters')
        .findOne({ _id: 'tokenId' })
      expect(counter.counter).toBe(1)
      expect(counter.year).toBe(currentYear)
    })

    test('Should increment counter within same year', async () => {
      const currentYear = new Date().getFullYear()

      // First call
      const result1 = await nextTrackerID({ db })
      const counter1 = await db
        .collection('counters')
        .findOne({ _id: 'tokenId' })

      // Second call
      const result2 = await nextTrackerID({ db })
      const counter2 = await db
        .collection('counters')
        .findOne({ _id: 'tokenId' })

      expect(result1).not.toBe(result2)
      expect(counter2.counter).toBe(counter1.counter + 1)
      expect(counter2.year).toBe(currentYear)
    })
  })
})
