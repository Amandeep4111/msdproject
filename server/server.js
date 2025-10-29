import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ===== Basic security & performance middleware =====
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// ===== Logging =====
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ===== Rate limiting =====
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api/", apiLimiter);

// ===== Request parsing / size limits =====
// Increased limit to 50mb in case users upload long base64 or large image URLs
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===== CORS =====
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

// ===== Connect MongoDB =====
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ===== Routes =====
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);

// ===== Test Route =====
app.get("/", (req, res) => res.send("🌱 Flower Garden API is running..."));

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err?.stack || err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// ===== Graceful Shutdown =====
const shutdown = (signal) => {
  console.log(`\n🔌 Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error("Forcing shutdown.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
