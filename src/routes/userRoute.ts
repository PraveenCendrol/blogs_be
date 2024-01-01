import { protect } from "./../controllers/userController";
import { Router } from "express";
import { addUser, findMe, login } from "../controllers/userController";

const router = Router();

router.route("/").post(addUser).get(protect, findMe);
router.route("/login").post(login);
export default router;
