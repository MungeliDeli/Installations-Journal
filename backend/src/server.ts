import app from "./app.ts";
import { connectDB } from "./config/db.ts";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log("running on port", PORT);
  await connectDB();
});
