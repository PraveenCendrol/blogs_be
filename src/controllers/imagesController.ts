import { IUploadParams, uploadS3Function } from "../services/cloudFlareR2";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const uploadImages = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please select an image to upload", 400));
  }

  // Prepare data to upload to S3
  const fileData: IUploadParams = {
    fileContent: req.file.buffer,
    fileName: req.file.originalname || "defaultFileName", // Provide a default filename if original name is not available
    contentType: req.file.mimetype,
  };

  // Upload image to S3
  const url = await uploadS3Function(next, fileData);

  res.status(200).json({ message: "File uploaded to S3 successfully", url });
});
