import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

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

export const uploadS3Function = async (
  next: NextFunction,
  fileData: IUploadParams
) => {
  try {
    const fileName = `${fileData.fileName}-${new Date().getTime()}`;
    const params: PutObjectCommandInput = {
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: fileData.fileContent,
      ContentType: fileData.contentType,
    };
    const uploadCommand = new PutObjectCommand(params);
    const res = await S3.send(uploadCommand);
    return `https://localhost.pkbmg.shop/${fileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    next(new AppError("Something terribly went wrong", 500));
    return null;
  }
};

export const deleteS3Function = async (fileKey: string) => {
  const input: DeleteObjectCommandInput = {
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  };
  const deleteCommand = new DeleteObjectCommand(input);

  try {
    await S3.send(deleteCommand);
    return "File Deleted Successfully";
  } catch (error) {
    console.log(
      `Failed to delete the file with key "${fileKey}" from AWS S3 bucket `
    );
  }
};
