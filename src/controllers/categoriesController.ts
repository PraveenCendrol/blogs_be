import { NextFunction, Response } from "express";
import Category from "../models/categoriesModal";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { successResponse } from "../utils/responseMessage";
import { AuthRequest } from "./userController";

export const addCategory = catchAsync(async (req, res, next) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return next(new AppError("Please provide category name", 400));
  }
  // Store category in the database
  const newCategory = await Category.create({
    categoryName,
    added_by: req.user?._id,
  });

  return successResponse(res, "Category added successfully", { newCategory });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const search = req.params.search;
  let query = Category.find();
  const regex = new RegExp(search, "i");
  if (search) {
    query = query.regex("categoryName", regex);
  }

  const categories = await query;
  return successResponse(res, "Successfully retrieved all categories", {
    totalResults: categories.length,
    results: categories,
  });
});

const _checkUser = (req: AuthRequest) => {
  return !(req.user?.role === "admin");
};

export const editCategory = catchAsync(async (req, res, next) => {
  _checkUser(req) &&
    next(
      new AppError("You don't have permission to perform this action.", 403)
    );
  if (!req.body._id || req.body.categoryName) {
    return next(new AppError("No category provided", 400));
  }

  const updatedCategory = Category.findByIdAndUpdate(req.body._id, {
    categoryName: req.body.categoryName,
  });

  return successResponse(res, "Category updated successfully", {
    updatedCategory,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  _checkUser(req) &&
    next(
      new AppError("You don't have permission to perform this action.", 403)
    );
  if (!req.body._id) {
    return next(new AppError("No category provided", 400));
  }
  //TO-DO Check if the category is still being used by a product

  const deletedCategory = await Category.deleteOne({ _id: req.body._id });

  if (!deletedCategory.deletedCount) {
    return next(new AppError("Could not find category for deletion", 404));
  }
  return successResponse(res, "Category has been deleted", {
    deletedCategory,
  });
});
