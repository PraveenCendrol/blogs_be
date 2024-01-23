import { Router } from "express";
import {
  addBlog,
  getBlog,
  getBlogByQuery,
  updateBlog,
} from "../controllers/blogsController";
import { protect } from "../controllers/userController";

const BlogsRouter = Router();

BlogsRouter.route("/")
  .post(protect, addBlog)
  .patch(protect, updateBlog)
  .get(getBlogByQuery);
BlogsRouter.route("/:id").get(getBlog);

export default BlogsRouter;
