import { Router } from "express";
import { upload } from "../utils/multerUpload";
import { uploadImages } from "../controllers/imagesController";

const ImagesRouter = Router();

ImagesRouter.route("/").post(upload.single("image"), uploadImages);

export default ImagesRouter;
