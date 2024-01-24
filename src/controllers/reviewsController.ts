import Reviews from "../models/reviewsModal";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";

export const addReview = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  const user_id = req.user?._id;
  const newReview = await Reviews.create({ user_id, message });
  return successResponse(res, "Review Submitted Successfully", {
    _id: newReview._id,
  });
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Reviews.find();

  successResponse(res, "Reviews Data", { allReviews });
});
