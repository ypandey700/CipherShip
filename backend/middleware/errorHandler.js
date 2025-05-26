// Centralized error handler middleware

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
