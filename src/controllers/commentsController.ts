import Comments from "../models/commentsModal";
import Replies from "../models/repliesModal";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";

export const addComments = catchAsync(async (req, res, next) => {
  const { comment, blog_id } = req.body;
  const user_id = req.user?._id;

  const commentDoc = await Comments.create({
    comment,
    blog_id,
    user_id,
  });
  await commentDoc.populate("user_id");
  return successResponse(res, "Comment added successfully", commentDoc);
});

export const editComment = catchAsync(async (req, res, next) => {
  const { _id, comment } = req.body;
  if (!comment || !_id) {
    return next(
      new AppError("Need new comment and _id for editing a comment", 404)
    );
  }
  const commentDoc = await Comments.findById(_id);
  if (!commentDoc) {
    return next(new AppError("No such comment found", 404));
  }
  if (commentDoc.user_id.toString() !== req.user?._id.toString()) {
    return next(
      new AppError("You don't have permission to perform this action", 403)
    );
  }
  commentDoc.comment = comment;
  const updatedComment = await commentDoc.save();
  return successResponse(res, "Comment edited successfully", {
    updatedComment,
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const { _id } = req.body;
  if (!_id) {
    return next(new AppError("Please provide valid id", 400));
  }
  const deletedCom = await Comments.deleteOne({ _id, user_id: req.user?._id });

  if (!deletedCom.deletedCount) {
    return next(
      new AppError("You do not have access to delete this comment.", 401)
    );
  }
  const deleteRes = await Replies.deleteMany({ comment_id: _id });
  return successResponse(res, "Comment deleted successfully", {}, 204);
});

export const getAllCommentPerUser = catchAsync(async (req, res, next) => {
  const allCommentsPerUser = await Comments.find({ user_id: req.user?._id });

  return successResponse(res, "All Comments posted by user", {
    total: allCommentsPerUser.length,
    comments: allCommentsPerUser,
  });
});
export const getAllCommentPerBlog = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("Invalid or no blog ID", 400));
  }

  const allCommentsPerBlog = await Comments.find({
    blog_id: req.params.id,
  })
    .populate("user_id", "firstname lastname")
    .sort({ createdAt: -1 });

  return successResponse(res, "All Comments posted for the blog", {
    total: allCommentsPerBlog.length,
    comments: allCommentsPerBlog,
  });
});

export const countCommentPerBlog = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No Blog Id Provided", 400));
  }
  const allCommentsPerBlog = await Comments.find({
    blog_id: req.params.id,
  });

  return successResponse(res, "Total comments", {
    totalComments: allCommentsPerBlog.length,
  });
});
