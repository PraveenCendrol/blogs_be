import { Model, Schema, Types, model } from "mongoose";

interface ICategories extends Document {
  _id: Types.ObjectId;
  categoryName: string;
  added_by: Types.ObjectId;
}

const categoriesSchema = new Schema<ICategories, Model<ICategories>>(
  {
    categoryName: {
      type: String,
      required: [true, "A Category name is required to create a category"],
      unique: true,
    },
    added_by: {
      type: Schema.Types.ObjectId,
      required: [true, "A user should be there to a"],
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Category = model<ICategories>("category", categoriesSchema);

export default Category;
