import Joi from 'joi'

export const counterSchema = Joi.object({
  _id: Joi.string().required(), // e.g., 'tokenId', 'serialNumber', etc.
  counter: Joi.number().min(0).default(0),
  lastUpdated: Joi.date().default(() => new Date())
})

// Example document:
// {
//   _id: "tokenId",
//   counter: 42,
//   lastUpdated: "2024-03-21T10:00:00.000Z"
// }
