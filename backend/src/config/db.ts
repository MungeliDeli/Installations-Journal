import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Db connected");
  } catch (error) {
    console.error("Could not connect to the Database", error);
    process.exit(1);
  }
};
