import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ---------------- ROUTES IMPORT ----------------
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import tweetLikeRouter from "./routes/tweetLike.routes.js";
import feedRouter from "./routes/feed.routes.js";





// ---------------- ROUTES DECLARATION ----------------
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/tweets", tweetLikeRouter);
app.use("/api/v1/feed", feedRouter);
export default app;
