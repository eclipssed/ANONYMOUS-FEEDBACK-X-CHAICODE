import mongoose, { mongo } from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already connected.");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully.");
  } catch (error) {
    console.log("Failed to connect to the database.", error);
    process.exit();
  }
}

export default dbConnect
