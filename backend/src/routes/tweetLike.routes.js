import { Router } from "express";
import { toggleTweetLike } from "../controllers/tweet.like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:tweetId/like", verifyJWT, toggleTweetLike);

export default router;
