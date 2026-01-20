import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

/**
 * Create tweet
 * POST /api/v1/tweets
 */
export const createTweet = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Tweet content is required",
            });
        }

        const tweet = await Tweet.create({
            content,
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            data: tweet,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all tweets
 * GET /api/v1/tweets
 */
export const getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate("owner")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: tweets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete tweet
 * DELETE /api/v1/tweets/:tweetId
 */
export const deleteTweet = async (req, res) => {
    try {
        const { tweetId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid tweet ID",
            });
        }

        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found",
            });
        }

        if (tweet.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this tweet",
            });
        }

        await tweet.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Tweet deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
