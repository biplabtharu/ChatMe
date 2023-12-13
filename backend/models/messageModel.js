import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
    },
  },
  { timestamps: true }
);

const MESSAGE = model("message", messageSchema);

export default MESSAGE;
