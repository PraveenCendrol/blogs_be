import { protect } from "./../controllers/userController";
import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
} from "../controllers/categoriesController";

const CategoryRouter = Router();

CategoryRouter.route("/")
  .post(protect, addCategory)
  .get(getAllCategories)
  .patch(protect, editCategory)
  .delete(protect, deleteCategory);
CategoryRouter.route("/:search").get(getAllCategories);

export default CategoryRouter;
