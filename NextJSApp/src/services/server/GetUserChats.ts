import axios from "axios"
import { cookies } from "next/headers"

export interface Chat {
    participants: { _id: string; name: string; profilePicture?: string }[];
    lastMessage: { text?: string; picture?: string; _id?: string } | null;
    updatedAt?: string;
    createdAt?: string;
    _id?: string;
}

export default async function GetUserChats() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            console.error("No access token found in cookies.");
            return null;
        }

        const axiosResponse = await axios.get(`${process.env.NEXT_MESSAGE_SERVICE_URL}/api/messages/Get-User-Chats`,{ headers: { Authorization: `Bearer ${token}` } });

        if(axiosResponse.status === 200) {
            return axiosResponse.data?.data as Chat[] || null;
        } else {
            return null;
        }
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
        }
        return null;
    }
}