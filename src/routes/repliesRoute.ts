import { Router } from "express";
import {
  addCommentReplies,
  editCommentReplies,
  getAllRepliesPerComment,
} from "../controllers/repliesController";
import { protect } from "../controllers/userController";

const RepliesRoute = Router();
RepliesRoute.route("/:commentId").get(getAllRepliesPerComment);
RepliesRoute.use(protect);
RepliesRoute.route("/:commentId")
  .post(addCommentReplies)
  .get(getAllRepliesPerComment);
RepliesRoute.route("/:replyId").post(editCommentReplies);

export default RepliesRoute;
