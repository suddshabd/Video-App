import { Like } from "../models/like.model.js";

/**
 * Toggle like on tweet
 * POST /api/v1/tweets/:tweetId/like
 */
export const toggleTweetLike = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const userId = req.user._id;

        const existingLike = await Like.findOne({
            tweet: tweetId,
            likedBy: userId,
        });

        // UNLIKE
        if (existingLike) {
            await existingLike.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Tweet unliked",
            });
        }

        // LIKE
        const like = await Like.create({
            tweet: tweetId,
            likedBy: userId,
        });

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
