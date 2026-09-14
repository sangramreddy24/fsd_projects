// middleware/errorHandler.js
// Global error-handling middleware.
//
// Express identifies a 4-argument function as an error handler.
// Any route/middleware that calls next(err) -- or throws inside an
// async wrapper -- will land here instead of crashing the process.
//
// Rules:
//  - Always respond with JSON (never HTML).
//  - Reuse the status code already attached to the error if present,
//    otherwise fall back to 500.

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log the stack trace to the server console for debugging.
  console.error("[ERROR]", err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;