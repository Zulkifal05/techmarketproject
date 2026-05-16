import { connectDB } from "@/utils/ConnectDB"
import UserModel from "@techmarket/models/dist/UserModel"
import { User } from "@techmarket/models/dist/UserModel"

type UserType = User & {
    _id?: string;
}

export default async function GetSpecificUser(userID: string) : Promise<UserType | null> {
    connectDB();
    try {
        const user = await UserModel.findById(userID).select("-password -refreshToken").lean();

        if(!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}