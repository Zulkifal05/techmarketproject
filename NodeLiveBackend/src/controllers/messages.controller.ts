import { Request , Response } from "express"
import { Types } from "mongoose"
import MessageModel from "../models/messages.model.js"
import isCloudinaryUrl from "../utils/cloudinaryURLcheck.js"
import { getReceiverSocketId, io } from "../index.js"

export async function SendMessage(req: Request,res: Response) {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { receiver, text, picture } = req.body;

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

        // If both text and picture are provided
        if(text && picture) {
            const newMessage = new MessageModel({
                sender: req.user._id,
                receiver,
                text,
                picture
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketId = getReceiverSocketId(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
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
                text
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketId = getReceiverSocketId(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
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
                picture
            });
            await newMessage.save();

            // Emit the new message to the receiver if they are online
            const receiverSocketId = getReceiverSocketId(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
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