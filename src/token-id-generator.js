import Sqids from 'sqids'

// Number of digits to use from the year for the token ID prefix
export const YEAR_DIGITS_LENGTH = 2

const sqids = new Sqids({
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  minLength: 6
})

/**
 * Gets the next counter value from MongoDB
 * @param {Object} db - MongoDB database instance
 * @returns {Promise<number>} The next counter value
 */
async function getNextCounter(db) {
  const currentYear = new Date().getFullYear()
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: 'tokenId' },
    [
      {
        $set: {
          year: currentYear,
          counter: {
            $cond: {
              if: { $ne: ['$year', currentYear] },
              then: 1,
              else: { $add: ['$counter', 1] }
            }
          }
        }
      }
    ],
    {
      upsert: true,
      returnDocument: 'after'
    }
  )
  if (!result?.counter) {
    throw new Error('Failed to get counter value')
  }
  return result.counter
}

/**
 * Generates a unique token ID based on a sequential counter
 * @param {Object} request - Hapi request object
 * @returns {Promise<string>} A unique token ID in format YYXXXXXX where YY is the year and XXXXXX is alphanumeric
 */
export const nextTrackerID = async (request) => {
  if (!request?.db) {
    throw new Error('Database instance is required')
  }
  const year = new Date().getFullYear().toString().slice(-YEAR_DIGITS_LENGTH)
  const counter = await getNextCounter(request.db)
  const id = sqids.encode([counter])
  return `${year}${id}`
}
