import { Document, Model, model } from "mongoose";
import { Schema } from "mongoose";
import BlogPost from "./blogsModal";

interface IComment extends Document {
  _id: Schema.Types.ObjectId;
  comment: string;
  user_id: Schema.Types.ObjectId;
  blog_id: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment, Model<IComment>>(
  {
    comment: { type: String, required: [true, "A comment is require"] },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: [true, "blog id is required"],
      validate: {
        validator: async function (value: Schema.Types.ObjectId) {
          const blog = await BlogPost.findById(value);
          return blog !== null;
        },
        message: (props) => `${props.value} is not a valid blog id`,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Comments = model<IComment>("Comments", commentSchema);

export default Comments;
