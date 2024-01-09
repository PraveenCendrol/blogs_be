import { protect, verifytoken } from "./../controllers/userController";
import { Router } from "express";
import { addUser, findMe, login } from "../controllers/userController";
//  /user
const router = Router();

router.route("/verify").get(protect, verifytoken);
router.route("/").post(addUser).get(protect, findMe);
router.route("/login").post(login);
export default router;
