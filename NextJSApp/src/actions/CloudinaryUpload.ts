"use server"

import { cloudinary } from "@/utils/Cloudinary"
import { verifyJWT } from "@/utils/VerifyJWT"

export const generateCloudinarySignatureAction = async (token: string) => {
    const user = await verifyJWT(token)

    if(!user) {
        throw new Error("Unauthorized")
    }

    const paramsToSign = {
        timestamp: Math.floor(new Date().getTime() / 1000),
        folder: "TechMarket_Uploads",
    };

    const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.NEXT_CLOUDINARY_API_SECRET as string,
    );

    return {
    signature: signature,
    apiKey: process.env.NEXT_CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
    timestamp: paramsToSign.timestamp,
    folder: paramsToSign.folder,
  };
}
