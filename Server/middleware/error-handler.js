// const { CustomError } = require("../error");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.StatusCodes).json({ msg: err.message });
  // }

  if (err.code && err.code === 11000) {
    CustomError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    CustomError.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    CustomError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    CustomError.statusCode = 400;
  }

  // if (err.name === "CastError") {
  //   CustomError.msg = `no item found with id ${err.value} hi`;
  //   CustomError.statusCode = 404;
  // }

  // if (err.name === "CastError" && Object.values(err.value).length > 1) {
  //   CustomError.msg = `no item found with id ${Object.values(err.value)[0]}`;
  //   CustomError.statusCode = 404;
  // }

  // return res
  //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //   .json({ msg: "Something went wrong, please try again later" });
  return res.status(CustomError.statusCode).json(CustomError.msg);
};

module.exports = errorHandlerMiddleware;
