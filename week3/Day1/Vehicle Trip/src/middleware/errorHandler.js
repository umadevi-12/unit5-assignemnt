function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
}

module.exports = errorHandler;
