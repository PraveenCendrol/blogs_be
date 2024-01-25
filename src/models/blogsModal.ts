import cheerio from "cheerio";
import mongoose, { Model, Schema, Types, model } from "mongoose";
import { deleteS3Function } from "../services/cloudFlareR2";

// Main Blog Type

export interface IBlogContent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  hashtags: string[];
  readtime: number;
  blogImages: string;
  filterImages: string[] | null | undefined;
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
    filterImages: {
      type: [String],
      default: null,
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

export function extractFilenameFromUrl(url: string): string | null {
  const prefix = "https://localhost.pkbmg.shop/";
  const startIndex = url.indexOf(prefix);

  if (startIndex !== -1) {
    // Adding the length of the prefix to get the start index of the filename
    const filenameStart = startIndex + prefix.length;
    const filename = url.substring(filenameStart);
    return filename;
  } else {
    // If the prefix is not found, return null or handle it accordingly
    return null;
  }
}
blogPostSchema.pre<IBlogContent>("save", async function (this, next) {
  const wordsPerMinute = 200;
  const words = this.content.trim().split(/\s+/).length;
  const readTime = words / wordsPerMinute;

  const estimatedReadTime = Math.ceil(readTime);
  const htmlString = this.content;
  const $ = cheerio.load(htmlString);
  const imgElements = $("img");
  let srcList: string[] = [];
  for (const i of imgElements) {
    srcList.push($(i).attr("src") || "");
  }
  for (const i of this.filterImages || []) {
    if (!srcList.includes(i)) {
      let extractValue = extractFilenameFromUrl(i) || "";
      await deleteS3Function(extractValue);
    }
  }
  if (srcList[0]) {
    this.blogImages = srcList[0];
  }

  this.readtime = estimatedReadTime;
  this.filterImages = undefined;
  next();
});

const BlogPost = model<IBlogContent>("BlogPost", blogPostSchema);

export default BlogPost;
