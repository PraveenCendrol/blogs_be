import { Router } from "express";
import { addBlog, getBlog, updateBlog } from "../controllers/blogsController";
import { protect } from "../controllers/userController";

const BlogsRouter = Router();

BlogsRouter.route("/").post(protect, addBlog).patch(protect, updateBlog);
BlogsRouter.route("/:id").get(getBlog);

export default BlogsRouter;
