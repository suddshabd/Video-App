import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./database/index.js";
import app from "./app.js";

// ---------------- ENV SETUP ----------------
dotenv.config({ path: "./.env" });

// ---------------- PATH SETUP (ESM SAFE) ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Health check
app.get("/health", (req, res) => {

    res.status(200).json({ msg: "success api is running good" });
});


// ---- Serve frontend in production ----
if (process.env.NODE_ENV === "production") {
    // __dirname is backend/src -> go up one to backend, then to frontend/dist
    const frontendPath = path.join(__dirname, "../../frontend/dist");

    // serve static assets (js, css, images, etc.)
    app.use(express.static(frontendPath));

    // SPA fallback: any non-API route returns index.html
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    });

// ---------------- GLOBAL ERROR HANDLING ----------------
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});
