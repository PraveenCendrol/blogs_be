import mongoose, { Model, Schema, Types, model } from "mongoose";

// Additional types
interface IEmbedded {
  startIndex: number;
  endIndex: number;
  url: string;
}

interface CommonContentProps {
  index: number;
}

interface TextStyle extends CommonContentProps {
  type: "text";
  data: string;
  embeddedLink?: IEmbedded[];
  style: "heading" | "subheading" | "underline";
}

interface ImageStyle extends CommonContentProps {
  type: "image";
  data: string;
  style: "large" | "medium" | "small";
}
interface BreakerStyle extends CommonContentProps {
  type: "breaker";
}

// Main Blog Type

type ContentItem = TextStyle | ImageStyle | BreakerStyle;
export interface IBlogContent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  content: ContentItem[];
  author: Schema.Types.ObjectId;
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// content schema
const contentItemSchema = new Schema<ContentItem>({
  type: { type: String, required: true, enum: ["text", "image", "breaker"] },
  data: { type: String },
  style: {
    type: String,
    enum: [
      "heading",
      "subheading",
      "underline",
      "large",
      "medium",
      "small",
      "breaker",
    ],
  },
  index: { type: Number, required: true },
});

// schema

const blogPostSchema: Schema<IBlogContent> = new Schema<
  IBlogContent,
  Model<IBlogContent>
>(
  {
    title: {
      type: String,
      required: [true, "A Blog must have a type"],
      trim: true,
    },
    content: [contentItemSchema],
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "A blog must have an author"],
    },
    hashtags: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BlogPost = model<IBlogContent>("BlogPost", blogPostSchema);

export default BlogPost;
