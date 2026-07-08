import { Request , Response } from "express"
import { Types } from "mongoose"
import MessageModel from "../models/messages.model.js"
import isCloudinaryUrl from "../utils/cloudinaryURLcheck.js"
import { getReceiverSocketId, io } from "../index.js"
import ChatModel from "../models/chat.model.js"

async function getOrCreateChat(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    let chat = await ChatModel.findOne({
        participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (chat) {
        return chat;
    }

    chat = new ChatModel({
        participants: [senderId, receiverId],
        lastMessage: null
    });

    await chat.save();
    return chat;
}

export async function SendMessage(req: Request,res: Response) {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { receiver, text, picture, chatID } = req.body;
        const senderId = req.user._id;

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

        let chatIdToUse = chatID;

        if(!chatID) {
            const existingChat = await getOrCreateChat(senderId, receiver);
            chatIdToUse = existingChat._id;
        } else if(!Types.ObjectId.isValid(chatIdToUse)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Chat ID"
            });
        }

        const baseMessageData = {
            sender: senderId,
            receiver,
            chatID: chatIdToUse
        };

        if(text && picture) {  // Check if both text and picture are present
            if(!isCloudinaryUrl(picture)) {
                return res.status(400).json({
                    success: false,
                    message: "Picture must be a valid Cloudinary URL"
                });
            }

            const newMessage = new MessageModel({
                ...baseMessageData,
                text,
                picture
            });
            await newMessage.save();

            await newMessage.populate("sender", "email");

            await ChatModel.findByIdAndUpdate(chatIdToUse, { lastMessage: newMessage._id });

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

        if(text) {  // Check if only text is present
            const newMessage = new MessageModel({
                ...baseMessageData,
                text
            });
            await newMessage.save();

            await newMessage.populate("sender", "email");

            await ChatModel.findByIdAndUpdate(chatIdToUse, { lastMessage: newMessage._id });

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

        if(picture) {  // Check if only picture is present
            if(!isCloudinaryUrl(picture)) {
                return res.status(400).json({
                    success: false,
                    message: "Picture must be a valid Cloudinary URL"
                });
            }

            const newMessage = new MessageModel({
                ...baseMessageData,
                picture
            });
            await newMessage.save();

            await newMessage.populate("sender", "email");

            await ChatModel.findByIdAndUpdate(chatIdToUse, { lastMessage: newMessage._id });

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
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const receiverId = typeof req.params.receiver === "string" ? req.params.receiver : undefined;
        const senderId = req.user._id;
        const { page = "1", limit = "30" } = req.query as {
            page?: string;
            limit?: string;
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

        if (!Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Receiver ID"
            });
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.max(1, Number(limit) || 20);
        const skip = (pageNumber - 1) * limitNumber;

        const messageQuery = {
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        };

        const totalMessages = await MessageModel.countDocuments(messageQuery);
        const messages = await MessageModel.find(messageQuery).populate("sender", "email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)

        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages,
            pagination: {
                total: totalMessages,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalMessages / limitNumber)
            }
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