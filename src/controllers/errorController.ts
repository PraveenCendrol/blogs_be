import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err: any): AppError => {
  const value = err.keyValue.name;
  const message = `Duplicate field value : ${value}`;
  return new AppError(message, 400);
};

const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((e: any) => e.message);
  const message = `Invalid input data ${errors}`;
  return new AppError(message, 400);
};

const sendErrorForDev = (err: AppError, res: Response): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForProd = (err: AppError, res: Response): Response => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something really went wrong",
  });
};

const jsonWebTokenError = (): AppError =>
  new AppError("Invalid token please login again", 401);

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (err.path) err = handleCastError(err);
    if (err.code === 11000) error = handleDuplicateError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.name === "JsonWebTokenError") error = jsonWebTokenError();
    if (err.name === "TokenExpiredError")
      error = new AppError("Token expired kindly login again", 401);

    return sendErrorForProd(error, res);
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
