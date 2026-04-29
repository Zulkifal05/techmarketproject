import mongoose from "mongoose"

interface Chat {
    participants: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId | null;
}

const chatSchema = new mongoose.Schema<Chat>(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: [true, "Participants are required"],
                index: true
            }
        ],
        lastMessage: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null 
        }
    },
    { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;