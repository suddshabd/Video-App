import { Subscription } from "../models/subscription.model.js";
import { Tweet } from "../models/tweet.model.js";

/**
 * Get feed (tweets from subscribed channels)
 * GET /api/v1/feed
 */
export const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;

        // get subscribed channels
        const subscriptions = await Subscription.find({
            subscriber: userId,
        }).select("channel");

        const channelIds = subscriptions.map((sub) => sub.channel);

        // fetch tweets from those channels
        const tweets = await Tweet.find({
            owner: { $in: channelIds },
        })
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
