import { Router } from "express";
import {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    createVideo
);
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);
router.patch("/:videoId", verifyJWT, updateVideo);
router.patch("/:videoId/toggle-publish", verifyJWT, togglePublishStatus);
router.delete("/:videoId", verifyJWT, deleteVideo);

export default router;
