import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      chalk.green.bold(
        `MongoDB connected successfully : ${connectionInstance.connection.host}`
      )
    );

    return connectionInstance;
  } catch (error) {
    console.error(
      chalk.red.bold("MongoDB connection error:"),
      chalk.red(error.message)
    );
    process.exit(1);
  }
};

export default connectDB;
