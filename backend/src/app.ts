import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import installationsRoutes from "./routes/installation.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import { erroHandler, notFoundHandler } from "./middleware/errorHandler.ts";
import multer from "multer";
import { multerErrorHandler } from "./middleware/mulrerErrorHandler.ts";

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

app.use("/api/installations", installationsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(multerErrorHandler);
app.use(notFoundHandler);
app.use(erroHandler);

export default app;
