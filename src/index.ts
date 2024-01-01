import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserRouter from "./routes/userRoute";
import errorHandler from "./controllers/errorController";
import AppError from "./utils/appError";
import BlogsRouter from "./routes/blogsRoute";
import UserReactionRoute from "./routes/userReactionRoute";
import CommentsRouter from "./routes/commentsRoute";
import RepliesRoute from "./routes/repliesRoute";
import CategoryRouter from "./routes/categoriesRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
console.log(
  process.env.R2_ACCOUNT_ID,
  process.env.R2_ACCESS_KEY,
  process.env.R2_SECRET_ACCESS_KEY
);
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send(`<div style=background-color:red;>
  Welcome to my Blog but don't stay for long time 
  </div>`);
});

app.use("/user", UserRouter);
app.use("/blogs", BlogsRouter);
app.use("/user-reaction", UserReactionRoute);
app.use("/comment", CommentsRouter);
app.use("/reply", RepliesRoute);
app.use("/category", CategoryRouter);

const url =
  process.env.MONGO_DB_URL && process.env.MONGO_DB_PASSWORD
    ? process.env.MONGO_DB_URL.replace(
        "<password>",
        process.env.MONGO_DB_PASSWORD
      )
    : "";

console.log(url);

mongoose.connect(url).then((e) => console.log("DB Connected successfully"));
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Api not found ${req.originalUrl} check the rout again`, 404)
  );
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
