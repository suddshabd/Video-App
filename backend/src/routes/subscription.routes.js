import { Router } from "express";
import {
    toggleSubscription,
    getChannelSubscribers,
    getMySubscriptions,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/toggle/:channelId", verifyJWT, toggleSubscription);
router.get("/channel/:channelId", getChannelSubscribers);
router.get("/my", verifyJWT, getMySubscriptions);

export default router;
