import express from "express";

import authRoutes from "./routes/auth.routes.js";
import { erroHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(erroHandler);

export default app;
