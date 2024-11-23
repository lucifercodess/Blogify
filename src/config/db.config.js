import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("MongoDB Connected");
    } else {
      console.log("Failed to connect to MongoDB");
    }
  } catch (e) {
    console.log(e);
  }
};
