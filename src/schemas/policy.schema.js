import Joi from 'joi'

export const policySchema = Joi.object({
  policyId: Joi.number().required(),
  itemsInsured: Joi.array().items(Joi.string()).default([]),
  revision: Joi.number().min(0).default(0),
  dateSet: Joi.date().default(() => new Date()),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
})

// Example document:
// {
//   policyId: 1,
//   itemsInsured: ["watch", "ring"],
//   revision: 2,
//   dateSet: "2024-03-21T10:00:00.000Z",
//   createdAt: "2024-03-21T09:00:00.000Z",
//   updatedAt: "2024-03-21T10:00:00.000Z"
// }
