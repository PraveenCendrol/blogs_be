import { Router } from "express";
import { protect } from "../controllers/userController";
import {
  addComments,
  deleteComment,
  editComment,
  getAllCommentPerBlog,
  getAllCommentPerUser,
} from "../controllers/commentsController";

const CommentsRouter = Router();
// using protect as middle ware for every route below this
CommentsRouter.route("/:id").get(getAllCommentPerBlog);
CommentsRouter.use(protect);
// protected routes
CommentsRouter.route("/")
  .post(addComments)
  .patch(editComment)
  .delete(deleteComment);
CommentsRouter.route("/user").get(getAllCommentPerUser);

export default CommentsRouter;
