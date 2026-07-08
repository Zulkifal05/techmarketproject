import { generateCloudinarySignatureAction } from "@/actions/CloudinaryUpload"
import axios from "axios"

export default async function UploadFileToCloudinary(file: File) {
    try {
        const signatureResult = await generateCloudinarySignatureAction()

        // Create form data for the upload
        const formData = new FormData()
        formData.append("file", file)
        formData.append("api_key", signatureResult.apiKey as string);
        formData.append("timestamp", `${signatureResult.timestamp}`);
        formData.append("signature", signatureResult.signature);
        formData.append("folder",signatureResult.folder)

        const uploadResult = await axios.post(`https://api.cloudinary.com/v1_1/${signatureResult.cloudName}/auto/upload`,formData)

        if(uploadResult.data?.secure_url) {
            return uploadResult.data?.secure_url
        }

        return null;
    } catch (error) {
        // console.error("Error in file upload",error)
        if(axios.isAxiosError(error)) {
            console.log(error.message)
        }

        if(error instanceof Error && error?.message === "UnAuthorized") {
            throw new Error("UnAuthorized");
        }

        return null;
    }
}