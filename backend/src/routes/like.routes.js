import { Router } from "express";
import { toggleLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// toggle like/unlike
router.post("/toggle", verifyJWT, toggleLike);

export default router;
