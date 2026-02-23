

const statusMap = {
ValidationError: 400,
ConflictError: 409,
NotFoundError: 404,
};


// централизованный error middleware
const errorHandler = (err, req, res, next) => {
  console.error(err); // лог
  const status = statusMap[err.name] || 500;
  console.log(status);
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
};

module.exports = { errorHandler };
