import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

/**
 * Create a new comment
 * POST /api/comments
 */
export const createComment = async (req, res) => {
    try {
        const { content, video } = req.body;

        if (!content || !video) {
            return res.status(400).json({
                success: false,
                message: "Content and video are required",
            });
        }

        const comment = await Comment.create({
            content,
            video,
            owner: req.user._id, // assumes auth middleware
        });

        return res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all comments for a video (paginated)
 * GET /api/comments/video/:videoId?page=1&limit=10
 */
export const getVideoComments = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID",
            });
        }

        const aggregate = Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $unwind: "$owner",
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        const options = {
            page: Number(page),
            limit: Number(limit),
        };

        const comments = await Comment.aggregatePaginate(aggregate, options);

        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update a comment
 * PATCH /api/comments/:commentId
 */
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this comment",
            });
        }

        comment.content = content || comment.content;
        await comment.save();

        return res.status(200).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete a comment
 * DELETE /api/comments/:commentId
 */
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (comment.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this comment",
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
