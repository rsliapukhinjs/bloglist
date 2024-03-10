const errorHandler = (error, req, res, next) => {
  console.log("Error!", error);
  next(error);
};

module.exports = { errorHandler };
