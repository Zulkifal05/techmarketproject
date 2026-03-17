import mongoose from "mongoose";

interface Message {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  text?: string;
  picture?: string;
}

const messageSchema = new mongoose.Schema<Message>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
      index: true
    },
    text: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;