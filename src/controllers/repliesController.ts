import Replies from "../models/repliesModal";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";

export const addCommentReplies = catchAsync(async (req, res, next) => {
  const { reply } = req.body;
  const comment_id = req.params.commentId;

  if (!reply) {
    return next(new AppError("Please provide a comment", 400));
  }

  const new_reply = await Replies.create({
    reply,
    user_id: req.user?._id,
    comment_id,
  });

  return successResponse(res, "Reply added successfully", new_reply);
});

export const editCommentReplies = catchAsync(async (req, res, next) => {
  const _id = req.params.replyId;
  const { reply } = req.body;

  const currReply = await Replies.findById(_id);
  if (!currReply) {
    return next(new AppError("No such reply exists", 404));
  }
  if (!(currReply.user_id.toString() === req.user?._id.toString())) {
    return next(
      new AppError("You do not have permission to perform this action", 401)
    );
  }
  currReply.reply = reply;
  const updatedReply = await currReply.save();
  return successResponse(
    res,
    "Reply has been edited successfully.",
    updatedReply
  );
});

export const getAllRepliesPerComment = catchAsync(async (req, res, next) => {
  const _id = req.params.commentId;
  const replies = await Replies.find({ comment_id: _id }).populate(
    "user_id",
    "firstname lastname avatar"
  );
  return successResponse(res, "All replies", {
    total: replies.length,
    replies,
  });
});

export const deleteReply = catchAsync(async (req, res, next) => {
  const _id = req.params.replyId;
  const reply = await Replies.findById(_id);
  if (!reply) {
    return next(new AppError("The specified reply does not exist", 404));
  }
  const isUser = reply.user_id.toString() === req.user?._id.toString();
  if (!isUser) {
    return next(
      new AppError("You are not authorized to perform this action", 403)
    );
  }
  await Replies.deleteOne({ _id: _id });

  return successResponse(res, "deleted successfully", {}, 204);
});
