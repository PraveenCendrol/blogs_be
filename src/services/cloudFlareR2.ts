import dotenv from "dotenv";
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectRequest,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { NextFunction } from "express";
import AppError from "../utils/appError";
dotenv.config();
const { R2_ACCESS_KEY, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET_NAME } =
  process.env;

export interface IUploadParams {
  fileContent: Buffer;
  fileName: string;
  contentType: string;
}

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

export const uploadImageFunction = async (
  next: NextFunction,
  fileData: IUploadParams
) => {
  try {
    const fileName = `${fileData.fileName}-${Date.now}`;
    const params: PutObjectCommandInput = {
      Bucket: "blog-dev",
      Key: fileData.fileName,
      Body: fileData.fileContent,
      ContentType: fileData.contentType,
    };
    const uploadCommand = new PutObjectCommand(params);
    const res = await S3.send(uploadCommand);
    console.log(res);
    return `https://localhost.pkbmg.shop/logo.jpeg`;
  } catch (error) {
    console.error("Error uploading image:", error);
    next(new AppError("Something terribly went wrong", 500));
    return null;
  }
};
