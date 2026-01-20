import { Router } from "express";
import {
    createTweet,
    getAllTweets,
    deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createTweet);
router.get("/", getAllTweets);
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;
