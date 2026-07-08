import axios from "axios"

export interface MessageItem {
    sender: {
        _id: string;
        email: string;
    };
    receiver: string;
    chatID: string;
    text?: string;
    picture?: string;
    updatedAt?: string;
    createdAt?: string;
    _id?: string;
}

export interface MessagesResponse {
    success: boolean;
    message: string;
    data: MessageItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default async function GetMessages(pageNo: number, limit: number, receiver: string): Promise<MessagesResponse | null> {
    try {
        const accessTokenResponse = await axios.get("/api/Auth/Get-Token")
        const accessToken = accessTokenResponse?.data?.accessToken

        if (!accessToken) {
            throw new Error("UnAuthorized")
        }

        const messages = await axios.get(
            `http://localhost:5000/api/messages/Get-Messages/${receiver}?page=${pageNo}&limit=${limit}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        )

        if (!messages?.data?.data || messages?.data?.data.length === 0) {
            return null
        }

        return messages.data as MessagesResponse
    } catch (error) {
        console.error("Error in getting messages", error)

        if (axios.isAxiosError(error) && error?.status === 400) {
            throw new Error("UnAuthorized")
        } else if (axios.isAxiosError(error) && error?.status === 404) {
            return null
        }

        return null
    }
}