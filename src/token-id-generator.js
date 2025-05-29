import Sqids from 'sqids'

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
  const result = await db
    .collection('counters')
    .findOneAndUpdate(
      { _id: 'tokenId' },
      { $inc: { counter: 1 } },
      { upsert: true, returnDocument: 'after' }
    )
  return result.counter
}

/**
 * Generates a unique token ID based on a sequential counter
 * @param {Object} request - Hapi request object
 * @returns {Promise<string>} A unique token ID in format YYXXXXXX where YY is the year and XXXXXX is alphanumeric
 */
export const nextTrackerID = async (request) => {
  const year = new Date().getFullYear().toString().slice(-2)
  const counter = await getNextCounter(request.db)
  const id = sqids.encode([counter])
  return `${year}${id}`
}
