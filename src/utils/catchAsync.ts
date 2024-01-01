import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../controllers/userController";

const catchAsync = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((e: Error) => next(e));
  };
};

export default catchAsync;
