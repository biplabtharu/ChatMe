import mongoose from "mongoose";

const connectDb = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL);
    if (conn) {
      console.log(`database connected successfully`.blue.bold);
    } else {
      console.log(`database connection error`.blue.bold);
    }
  } catch (err) {
    console.log(`mongodb connection error : ${err.messsage}`);
    process.exit();
  }
};

export default connectDb;
