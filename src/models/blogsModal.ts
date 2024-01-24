import cheerio from "cheerio";
import mongoose, { Model, Schema, Types, model } from "mongoose";

// Main Blog Type

export interface IBlogContent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  hashtags: string[];
  readtime: number;
  blogImages: string;
  createdAt: Date;
  updatedAt: Date;
  pin: boolean;
}

// content schema

// schema

const blogPostSchema: Schema<IBlogContent> = new Schema<
  IBlogContent,
  Model<IBlogContent>
>(
  {
    title: {
      type: String,
      required: [true, "A Blog must have a title"],
      trim: true,
    },
    content: String,
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "A blog must have an author"],
    },
    hashtags: {
      type: [String],
    },
    blogImages: {
      type: String,
      default: "",
    },
    readtime: {
      type: Number,
      default: 0,
    },
    pin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blogPostSchema.pre<IBlogContent>("save", function (this, next) {
  const wordsPerMinute = 200;
  const words = this.content.trim().split(/\s+/).length;
  const readTime = words / wordsPerMinute;

  const estimatedReadTime = Math.ceil(readTime);
  const htmlString = this.content;
  const $ = cheerio.load(htmlString);
  const imgElements = $("img");
  const src = $(imgElements[0]).attr("src");
  if (src) {
    this.blogImages = src;
  }

  this.readtime = estimatedReadTime;
  next();
});

const BlogPost = model<IBlogContent>("BlogPost", blogPostSchema);

export default BlogPost;
