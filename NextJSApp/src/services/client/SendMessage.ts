import axios from "axios"
import { MessageItem } from "./GetMessages"
import UploadFileToCloudinary from "./UploadFileToCloudinary"

interface SendMessageFormValues {
  message?: string,
  file?: File | null,
  receiver: string,
  chatID?: string
}

interface SendMessageResponse {
  success: boolean;
  message: string;
  data?: MessageItem;
}

export default async function SendMessage({ message, file, receiver, chatID }: SendMessageFormValues): Promise<MessageItem | null> {
    try {
        const accessTokenResponse = await axios.get("/api/Auth/Get-Token")
        const accessToken = accessTokenResponse?.data?.accessToken

        if (!accessToken) {
            throw new Error("UnAuthorized")
        }

        let messageData = {} as {
            text?: string;
            picture?: string;
            receiver: string;
            chatID?: string;
        }

        if(message && file) {  // Check if both message and file are present
            if(!file.type.startsWith("image/")) {
                throw new Error("Only image files are allowed");
            }

            const uploadedFileUrl = await UploadFileToCloudinary(file);
            if (!uploadedFileUrl) {
                throw new Error("File upload failed");
            }

            messageData = {
                text: message,
                picture: uploadedFileUrl,
                receiver: receiver,
            };
        } else if(message && !file) {  // Check if only message is present
            messageData = {
                text: message,
                receiver: receiver,
            };
        } else if(!message && file) {  // If only file is present
            if(!file.type.startsWith("image/")) {
                throw new Error("Only image files are allowed");
            }

            const uploadedFileUrl = await UploadFileToCloudinary(file);
            if (!uploadedFileUrl) {
                throw new Error("File upload failed");
            }

            messageData = {
                picture: uploadedFileUrl,
                receiver: receiver,
            };
        } else {  // If both message and file are empty, return early
            return null;
        }

        if(chatID) {
            messageData.chatID = chatID
        }

        const response = await axios.post<SendMessageResponse>("http://localhost:5000/api/messages/Send-Message", messageData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        });
        
        if(response.data.success) {
            return response.data.data as MessageItem;
        }

        return null;
    } catch (error) {
        console.error("Error sending message:", error);

        if (axios.isAxiosError(error) && error?.status === 400) {
            throw new Error("UnAuthorized")
        } else if (axios.isAxiosError(error) && error?.status === 401) {
            return null
        } else if (axios.isAxiosError(error) && error?.status === 403) {
            return null
        } else if (error instanceof Error && error.message === "UnAuthorized") {
            throw new Error("UnAuthorized")
        } else if (error instanceof Error && error.message === "File upload failed") {
            throw new Error("File upload failed")
        } else if (error instanceof Error && error.message === "Only image files are allowed") {
            throw new Error("Only image files are allowed")
        }

        return null;
    }
}