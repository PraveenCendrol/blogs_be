import { Document, Model, Schema, Types, model } from "mongoose";

interface IReplies extends Document {
  reply: string;
  user_id: Types.ObjectId;
  comment_id: Types.ObjectId;
}

const repliesSchema = new Schema<IReplies, Model<IReplies>>(
  {
    reply: {
      type: String,
      required: [true, "A replied message must have some comment "],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "A user must be there to reply for a comment"],
    },
    comment_id: {
      type: Schema.Types.ObjectId,
      required: [true, "A comment id is required for a reply to be done"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Replies = model<IReplies>("Reply", repliesSchema);

export default Replies;
