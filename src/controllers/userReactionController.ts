import UserReaction from "../models/userReactionModal";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";

// add reaction like dislike remove reaction

export const addReaction = catchAsync(async (req, res, next) => {
  const user_id = req.user?._id;
  const blog_id = req.params.id;
  const { reactionType } = req.body;
  if (!reactionType) {
    await UserReaction.deleteOne({ user_id, blog_id });
    return successResponse(res, "Success", {}, 204);
  }
  const user_reaction = await UserReaction.findOne({ user_id, blog_id });
  let final_reaction;
  if (!user_reaction) {
    final_reaction = await UserReaction.create({
      user_id,
      blog_id,
      reaction: reactionType,
    });
  } else {
    user_reaction.reaction = reactionType;
    final_reaction = await user_reaction.save();
  }

  return successResponse(res, "Success", final_reaction);
});
