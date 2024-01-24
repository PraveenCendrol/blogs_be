import { Model, Schema, Types, model } from "mongoose";

export interface IReview extends Document {
  name: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user_id: Types.ObjectId;
}

const reviewSchema = new Schema<IReview, Model<IReview>>(
  {
    message: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Please provide a valid User ID to associate this Review with.",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Reviews = model<IReview>("Review", reviewSchema);

export default Reviews;
