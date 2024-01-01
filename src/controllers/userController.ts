import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/responseMessage";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User, { IUser } from "../models/userModal";
import AppError from "../utils/appError";
import { promisify } from "util";

// interfaces

export interface AuthRequest extends Request {
  user?: IUser;
}

const signInToken = (id: mongoose.Types.ObjectId) => {
  let secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : "none";
  const token = jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createAndSendToken = (
  user: IUser,
  res: Response,
  statusCode: number,
  message: string
) => {
  const token = signInToken(user._id);
  const { firstname, lastname, username, email, role } = user;
  successResponse(
    res,
    message,
    { token, user: { firstname, lastname, username, email, role } },
    statusCode
  );
};

export const addUser = catchAsync(async (req, res, next) => {
  const {
    password,
    username,
    email,
    passwordConfirm,
    firstname,
    lastname,
    avatar,
  }: IUser = req.body;
  const newUser = await User.create({
    firstname,
    lastname,
    avatar,
    username,
    password,
    passwordConfirm,
    email,
    role: req.body.role || undefined,
  });

  return createAndSendToken(newUser, res, 201, "User added successfully");
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError("Required username && password", 400));
  }

  const user = await User.findOne({ username }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Email or Password is incorrect", 401));
  }

  createAndSendToken(user, res, 200, "User logged in successfully");
});

export const protect = catchAsync(async (req: AuthRequest, res, next) => {
  // get the token is it exist

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Kindly log in to See details", 401));
  }

  // verification the token
  const decoded = await promisify<string, string, any>(jwt.verify)(
    token,
    process.env.JWT_SECRET || ""
  );

  // check user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The User belonging to this token no longer exists", 401)
    );
  }

  // if user changed password after jwt issued

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    next(new AppError("Token expired please login again", 401));
  }

  // Access to protected route
  req.user = freshUser;
  next();
});

export const restrictTo = (...roles: ["admin" | "user"]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const userDetails = user?.role ? user.role : "user";

    if (!roles.includes(userDetails)) {
      return next(new AppError("You don't have permission to do it", 403));
    }

    return next();
  };
};

export const findMe = catchAsync(async (req, res, next) => {
  return successResponse(res, "your details", { user: req.user });
});
