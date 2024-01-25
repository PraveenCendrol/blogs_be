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
import cors from "cors";
import ImagesRouter from "./routes/imageRoute";
import ReviewsRouter from "./routes/reviewsRoute";
import { deleteS3Function } from "./services/cloudFlareR2";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/", (req: Request, res: Response) => {
  res.send(`<div style=background-color:red;>
  Welcome to my Blog but don't stay for long time 
  </div>`);
});

// app.get("/:image_name", async (req, res, next) => {
//   const del = await deleteS3Function(next, req.params.image_name);

//   res.status(200).json({
//     finished: "True",
//   });
// });
app.use("/image", ImagesRouter);
app.use("/user", UserRouter);
app.use("/blogs", BlogsRouter);
app.use("/user-reaction", UserReactionRoute);
app.use("/comment", CommentsRouter);
app.use("/reply", RepliesRoute);
app.use("/category", CategoryRouter);
app.use("/review", ReviewsRouter);

const url =
  process.env.MONGO_DB_URL && process.env.MONGO_DB_PASSWORD
    ? process.env.MONGO_DB_URL.replace(
        "<password>",
        process.env.MONGO_DB_PASSWORD
      )
    : "";

mongoose.connect(url).then((e) => console.log("DB Connected successfully"));
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Api not found ${req.originalUrl} check the rout again`, 404)
  );
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
