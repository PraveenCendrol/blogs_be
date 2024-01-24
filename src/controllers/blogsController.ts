import { ObjectId } from "bson";
import BlogPost, { IBlogContent } from "../models/blogsModal";
import { uploadS3Function } from "../services/cloudFlareR2";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";
import { PipelineStage, SortOrder } from "mongoose";

export const addBlog = catchAsync(async (req, res, next) => {
  const { title, hashtags, content, images }: IBlogContent = req.body;

  if (!content?.length || !title?.length)
    return next(new AppError("Content and Title is required for a blog", 400));

  const blog = await BlogPost.create({
    title,
    author: req.user?._id,
    hashtags,
    content: content,
    images: images,
  });

  return successResponse(res, "Blog added successfully", { id: blog._id }, 200);
});

export const getBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id).populate("author");
  return successResponse(res, `Blog details for ${req.params.id}`, { blog });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const { _id, content, hashtags, title }: IBlogContent = req.body;
  const blog = await BlogPost.findById(_id);
  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }
  if (blog && title) {
    blog.title = title;
  }

  if (blog && content?.length) {
    blog.content = content;
  }

  if (blog && hashtags?.length) {
    blog.hashtags = [...new Set([...blog.hashtags, ...hashtags])];
  }
  let updatedBlog;
  if (!(blog?.author.toString() == req.user?._id.toString())) {
    return next(new AppError("You don't have permission to edit it", 403));
  }
  updatedBlog = await blog.save();
  return successResponse(res, `Updated successfully Blog ${_id}`, {
    updatedBlog,
  });
});

export const getBlogByQuery = catchAsync(async (req, res, next) => {
  const totalCount = await BlogPost.estimatedDocumentCount();

  const sort: SortOrder = (req.query.sort as SortOrder) || "desc";
  const sort_type = req.query.sort_type || "createdAt";
  const sortQuery: {
    [key: string]: SortOrder;
  } = { pin: -1 };
  sortQuery[`${sort_type}`] = sort;
  let limit: number;
  if (!req.query.limit) {
    limit = 2;
  } else {
    limit = parseInt(req.query.limit as string);
  }

  if (!req.query.page) {
    var page = 1;
  } else {
    page = parseInt(req.query.page as string);
  }

  const totalPages = Math.ceil(totalCount / +limit);
  const nextPage = +page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  const blogs = await BlogPost.find()
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .select(["-content"])
    .populate("author", ["firstname", "lastname", "avatar"]);
  const response = {
    total: totalCount,
    totalPages,
    currentPage: page,
    prevPage,
    nextPage: nextPage,
    blogs: blogs,
  };

  return successResponse(res, `Blogs for page:${page} `, response);
});
