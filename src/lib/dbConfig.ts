import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB is connected");
    });
    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error, please make sure that DB is up and running: ", err
      );
      process.exit()
    });
  } catch (error) {
    console.log("something went wrong while connecting to the db");
    console.log("error: ", error);
  }
}
