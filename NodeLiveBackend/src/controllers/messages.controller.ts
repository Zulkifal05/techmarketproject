import { Request , Response } from "express"
import { Types } from "mongoose"
import MessageModel from "../models/messages.model.js"
import isCloudinaryUrl from "../utils/cloudinaryURLcheck.js"
import { getReceiverSocketId, io } from "../index.js"
import ChatModel from "../models/chat.model.js"

export async function SendMessage(req: Request,res: Response) {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { receiver, text, picture, chatID } = req.body;
        let chatIdToUse = chatID;  // This will either be the provided chatID or the new chatID if a new chat is created

        if (!receiver) {
            return res.status(400).json({
                success: false,
                message: "Receiver is required"
            });
        }

        if(!text && !picture) {
            return res.status(400).json({
                success: false,
                message: "Either text or picture is required"
            });
        }

        if(!Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Receiver ID"
            });
        }

        //If no chatID is provided, create a new chat and use its ID for the message
        if(!chatID) {
            const newChat = new ChatModel({
                participants: [req.user._id, receiver],
                lastMessage: null
            });
            await newChat.save();
            chatIdToUse = newChat._id;
        } else { // If chatID is provided, validate it
            if(!Types.ObjectId.isValid(chatIdToUse)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Chat ID"
                });
            }
        }

        // If both text and picture are provided
        if(text && picture) {
            const newMessage = new MessageModel({
                sender: req.user._id,
                receiver,
                text,
                picture,
                chatID: chatIdToUse
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketIds = getReceiverSocketId(receiver);
            if (receiverSocketIds && receiverSocketIds.length > 0) {
                receiverSocketIds.forEach(socketId => {
                    io.to(socketId).emit("newMessage", newMessage);
                });
            }

            return res.status(201).json({
                success: true,
                message: "Message sent successfully",
                data: newMessage
            });
        }

        // If only text is provided
        if(text) {
            const newMessage = new MessageModel({
                sender: req.user._id,
                receiver,
                text,
                chatID: chatIdToUse
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketIds = getReceiverSocketId(receiver);
            if (receiverSocketIds && receiverSocketIds.length > 0) {
                receiverSocketIds.forEach(socketId => {
                    io.to(socketId).emit("newMessage", newMessage);
                });
            }

            return res.status(201).json({
                success: true,
                message: "Message sent successfully",
                data: newMessage
            });
        }

        // If only picture is provided
        if(picture) {
            if(!isCloudinaryUrl(picture)) {
                return res.status(400).json({
                    success: false,
                    message: "Picture must be a valid Cloudinary URL"
                });
            }

            const newMessage = new MessageModel({
                sender: req.user._id,
                receiver,
                picture,
                chatID: chatIdToUse
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketIds = getReceiverSocketId(receiver);
            if (receiverSocketIds && receiverSocketIds.length > 0) {
                receiverSocketIds.forEach(socketId => {
                    io.to(socketId).emit("newMessage", newMessage);
                });
            }

            return res.status(201).json({
                success: true,
                message: "Message sent successfully",
                data: newMessage
            });
        }
    } catch (error) {
        console.log("Error in SendMessage Controller: ",error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export async function GetMessages(req: Request,res: Response) {
    try {
        const { receiver } = req.body;

        if (!receiver) {
            return res.status(400).json({
                success: false,
                message: "Receiver is required"
            });
        }

        const messages = await MessageModel.find({
            $or: [
                { sender: req.user?._id, receiver },
                { sender: receiver, receiver: req.user?._id }
            ]
        }).sort({ createdAt: 1 });

        if(messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No messages found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages
        });
    } catch (error) {
        console.log("Error in GetMessages Controller: ",error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export async function GetUserChats(req: Request,res: Response) {
    try {
        const userId = req.user?._id;

        const chats = await ChatModel.find({
            participants: userId
        }).populate("participants", "name profilePicture").populate("lastMessage");

        if(chats.length === 0 || !chats) {
            return res.status(404).json({
                success: false,
                message: "No chats found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            data: chats
        });
    } catch (error) {
        console.log("Error in GetUserChats Controller: ",error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}