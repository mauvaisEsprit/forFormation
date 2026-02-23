// schemas/createUser.schema.js
const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().max(100).trim(),
});

module.exports = { createUserSchema };