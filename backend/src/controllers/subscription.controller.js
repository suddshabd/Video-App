import { Subscription } from "../models/subscription.model.js";

/**
 * Toggle subscribe / unsubscribe
 * POST /api/v1/subscriptions/toggle/:channelId
 */
export const toggleSubscription = async (req, res) => {
    try {
        const { channelId } = req.params;
        const subscriberId = req.user._id;

        if (subscriberId.toString() === channelId) {
            return res.status(400).json({
                success: false,
                message: "You cannot subscribe to yourself",
            });
        }

        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId,
        });

        // Unsubscribe
        if (existingSubscription) {
            await existingSubscription.deleteOne();
            return res.status(200).json({
                success: true,
                message: "Unsubscribed successfully",
            });
        }

        // Subscribe
        const subscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId,
        });

        return res.status(201).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get subscribers of a channel
 * GET /api/v1/subscriptions/channel/:channelId
 */
export const getChannelSubscribers = async (req, res) => {
    try {
        const { channelId } = req.params;

        const subscribers = await Subscription.find({
            channel: channelId,
        }).populate("subscriber");

        return res.status(200).json({
            success: true,
            data: subscribers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get channels user subscribed to
 * GET /api/v1/subscriptions/my
 */
export const getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            subscriber: req.user._id,
        }).populate("channel");

        return res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
