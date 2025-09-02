function dataCheckMiddleware(req, res, next) {
  const required = ['title', 'description', 'priority', 'user'];
  const missing = required.filter(key => {
    const val = req.body[key];
    return val === undefined || val === null || String(val).trim() === '';
  });

  if (missing.length) {
    return res.status(400).json({ error: "Data insufficient, please provide all required fields" });
  }
  next();
}

module.exports = dataCheckMiddleware;
