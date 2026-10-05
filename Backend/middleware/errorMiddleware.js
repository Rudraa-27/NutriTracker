export const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors)
      .map((item) => item.message);

    return res.status(400).json({
      message: messages.join(", ")
    });
  }

  // Invalid MongoDB ObjectId
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid resource ID"
    });
  }

  // Duplicate unique field
  if (error.code === 11000) {
    const duplicatedField =
      Object.keys(error.keyPattern || {})[0];

    return res.status(409).json({
      message: duplicatedField
        ? `${duplicatedField} already exists`
        : "A duplicate value was provided"
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message
  });
};