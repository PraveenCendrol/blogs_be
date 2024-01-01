import BlogPost, { IBlogContent } from "../models/blogsModal";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";

export const addBlog = catchAsync(async (req, res, next) => {
  const { title, hashtags, content }: IBlogContent = req.body;

  if (!content?.length)
    return next(new AppError("Content is required for a blog", 400));

  const blog = await BlogPost.create({
    title,
    author: req.user?._id,
    hashtags,
    content,
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
