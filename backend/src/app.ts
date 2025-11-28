import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { erroHandler, notFoundHandler } from "./middleware/errorHandler.js";

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

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(erroHandler);

export default app;
