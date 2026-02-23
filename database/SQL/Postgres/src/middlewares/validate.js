// middlewares/validate.js
function validateSchema(schema) {
  return (req, res, next) => {
    console.log("Validate")
    try {
      schema.parse(req.body); // если не валидно — выбросит
      next();
    } catch (err) {
      // zod.errors → массив ошибок
      res.status(400).json({ errors: err.errors?.map(e => e.message) || ['Invalid request'] });
    }
  };
}

module.exports = { validateSchema };