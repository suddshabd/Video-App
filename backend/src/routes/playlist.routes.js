import { Router } from "express";
import {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createPlaylist);
router.get("/my", verifyJWT, getMyPlaylists);
router.get("/:playlistId", getPlaylistById);
router.patch("/:playlistId/add/:videoId", verifyJWT, addVideoToPlaylist);
router.patch("/:playlistId/remove/:videoId", verifyJWT, removeVideoFromPlaylist);
router.delete("/:playlistId", verifyJWT, deletePlaylist);

export default router;
