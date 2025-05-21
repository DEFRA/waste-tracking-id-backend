import { customAlphabet } from 'nanoid'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const nanoid = customAlphabet(alphabet, 6)

/**
 * Generates a unique token ID based on the current timestamp
 * @returns {string} A unique token ID
 */
export const nextTrackerID = () => {
  const year = new Date().getFullYear().toString().slice(-2)
  const id = nanoid()
  return `${id}-${year}`
}
