import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

/**
 * Toggle like (video / comment / tweet)
 * POST /api/v1/likes/toggle
 */
export const toggleLike = async (req, res) => {
    try {
        const { videoId, commentId, tweetId } = req.body;
        const userId = req.user._id;

        // ensure only ONE target is provided
        const targets = [videoId, commentId, tweetId].filter(Boolean);
        if (targets.length !== 1) {
            return res.status(400).json({
                success: false,
                message: "Like must be associated with exactly one target",
            });
        }

        const filter = {
            likedBy: userId,
        };

        if (videoId) filter.video = videoId;
        if (commentId) filter.comment = commentId;
        if (tweetId) filter.tweet = tweetId;

        const existingLike = await Like.findOne(filter);

        // UNLIKE
        if (existingLike) {
            await existingLike.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Unliked successfully",
            });
        }

        // LIKE
        const like = await Like.create(filter);

        return res.status(201).json({
            success: true,
            data: like,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
