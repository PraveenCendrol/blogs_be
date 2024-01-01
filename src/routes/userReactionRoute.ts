import { Router } from "express";
import { protect } from "../controllers/userController";
import { addReaction } from "../controllers/userReactionController";

const UserReactionRoute = Router();

UserReactionRoute.route("/:id").post(protect, addReaction);

export default UserReactionRoute;
