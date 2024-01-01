import { Response } from "express";

const statusCodes = {
  success: 200,
  clientError: 400,
  serverError: 500,
  entryCreated: 201,
  notFound: 404,
  entryRemoved: 204,
  forbidden: 403,
};

export const successResponse = (
  res: Response,
  msg: string,
  data = {},
  statusCode: number = 200
) => {
  return res.status(statusCode).json({ status: "success", msg, data });
};
