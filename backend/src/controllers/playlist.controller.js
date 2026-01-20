import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

/**
 * Create playlist
 * POST /api/v1/playlists
 */
export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            data: playlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all playlists of logged-in user
 * GET /api/v1/playlists/my
 */
export const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({
            owner: req.user._id,
        }).populate("videos");

        return res.status(200).json({
            success: true,
            data: playlists,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get playlist by ID
 * GET /api/v1/playlists/:playlistId
 */
export const getPlaylistById = async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID",
            });
        }

        const playlist = await Playlist.findById(playlistId)
            .populate("videos")
            .populate("owner");

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: playlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Add video to playlist
 * PATCH /api/v1/playlists/:playlistId/add/:videoId
 */
export const addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this playlist",
            });
        }

        if (playlist.videos.includes(videoId)) {
            return res.status(400).json({
                success: false,
                message: "Video already in playlist",
            });
        }

        playlist.videos.push(videoId);
        await playlist.save();

        return res.status(200).json({
            success: true,
            data: playlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Remove video from playlist
 * PATCH /api/v1/playlists/:playlistId/remove/:videoId
 */
export const removeVideoFromPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this playlist",
            });
        }

        playlist.videos = playlist.videos.filter(
            (id) => id.toString() !== videoId
        );

        await playlist.save();

        return res.status(200).json({
            success: true,
            data: playlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete playlist
 * DELETE /api/v1/playlists/:playlistId
 */
export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found",
            });
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this playlist",
            });
        }

        await playlist.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
