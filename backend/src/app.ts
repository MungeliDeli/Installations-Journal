import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import installationsRoutes from "./routes/installation.routes.js";
import userRoutes from "./routes/user.routes.js";
import { erroHandler, notFoundHandler } from "./middleware/errorHandler.js";
import multer from "multer";
import { multerErrorHandler } from "./middleware/mulrerErrorHandler.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", //frontend url
  credentials: true, //this allows the auth headers and cookies
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

app.use("/api/installations", installationsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(multerErrorHandler);
app.use(notFoundHandler);
app.use(erroHandler);

export default app;
