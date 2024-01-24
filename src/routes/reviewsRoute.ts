import { protect, restrictTo } from "./../controllers/userController";
import { Router } from "express";
import { addReview, getAllReviews } from "../controllers/reviewsController";

const ReviewsRouter = Router();

ReviewsRouter.route("/")
  .post(protect, addReview)
  .get(protect, restrictTo("admin"), getAllReviews);

export default ReviewsRouter;
