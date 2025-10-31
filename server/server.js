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

// Initialize app
const app = express();

// ===== Middleware Setup =====
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ===== Body Parser =====
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===== CORS Configuration =====
const allowedOrigin =
  process.env.FRONTEND_ORIGIN || "https://msdproject-client.onrender.com";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// ===== Connect to MongoDB Atlas =====
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ===== API Routes =====
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("🌸 Flower Garden API is running successfully!");
});

// ===== 404 Route =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack || err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// ===== Server Startup =====
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ===== Graceful Shutdown =====
const shutdown = (signal) => {
  console.log(`\n🔌 Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Force shutdown.");
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
