import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";

/**
 * Create a new video
 * POST /api/videos
 */
export const createVideo = async (req, res) => {
    try {
        const { tittle, description, duration } = req.body;

        // 🔴 FIXED VALIDATION
        if (
            !req.files?.videoFile ||
            !req.files?.thumbnail ||
            !tittle ||
            !description ||
            !duration
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const videoLocalPath = req.files.videoFile[0].path;
        const thumbnailLocalPath = req.files.thumbnail[0].path;

        const uploadedVideo = await uploadOnCloudinary(
            videoLocalPath,
            "video"
        );
        const uploadedThumbnail = await uploadOnCloudinary(
            thumbnailLocalPath,
            "image"
        );

        const video = await Video.create({
            videoFile: uploadedVideo.secure_url,
            thumbnail: uploadedThumbnail.secure_url,
            tittle,
            description,
            duration: Number(duration),
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all published videos (paginated)
 * GET /api/videos?page=1&limit=10
 */
export const getAllVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const aggregate = Video.aggregate([
            {
                $match: { isPublished: true },
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

        const videos = await Video.aggregatePaginate(aggregate, options);

        return res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get single video by ID
 * GET /api/videos/:videoId
 */
export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID",
            });
        }

        const video = await Video.findById(videoId).populate("owner");

        if (!video || !video.isPublished) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        // increment views
        video.views += 1;
        await video.save();

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update video
 * PATCH /api/videos/:videoId
 */
export const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this video",
            });
        }

        const allowedUpdates = [
            "tittle",
            "description",
            "thumbnail",
            "videoFile",
            "duration",
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                video[field] = req.body[field];
            }
        });

        await video.save();

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Toggle publish/unpublish video
 * PATCH /api/videos/:videoId/toggle-publish
 */
export const togglePublishStatus = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this video",
            });
        }

        video.isPublished = !video.isPublished;
        await video.save();

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete video
 * DELETE /api/videos/:videoId
 */
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this video",
            });
        }

        await video.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
