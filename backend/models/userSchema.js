import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default: "/images/avatar.png",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function (user) {
  try {
    const token = jwt.sign({ data: user }, process.env.SECRET_KEY);
    return token;
  } catch (err) {
    console.log(`jswonwebtoken error ${err}`);
  }
};

userSchema.methods.matchPassword = async function (password) {
  try {
    const passwordMatch = await bcrypt.compare(password, this.password);
    return passwordMatch;
  } catch (err) {
    console.log(`password matching bcrypt error ${err}`);
  }
};

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (err) {
    console.log(`bcrypt error: ${err}`);
  }
});

const USER = model("user", userSchema);

export default USER;
