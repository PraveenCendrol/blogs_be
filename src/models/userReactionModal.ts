import { Document, Model, Schema, model } from "mongoose";

interface IUserReaction extends Document {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  reaction: "like" | "dislike";
  blog_id: Schema.Types.ObjectId;
}

const userReactionSchema = new Schema<IUserReaction, Model<IUserReaction>>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Alike should have a User"],
      ref: "User",
    },
    blog_id: {
      type: Schema.Types.ObjectId,
      required: [true, "A like should be applied to a blog"],
      ref: "BlogPost",
    },
    reaction: {
      type: String,
      enum: ["like", "dislike"],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserReaction = model<IUserReaction>("UserReaction", userReactionSchema);

export default UserReaction;
