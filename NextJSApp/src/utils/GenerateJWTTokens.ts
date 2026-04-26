import jwt, { SignOptions } from "jsonwebtoken"
import { User as UserModel } from "@techmarket/models"

async function GenerateAccessAndRefreshToken (userId:string) {
    try {
        const user = await UserModel.findById(userId)

        if(!user) {
            throw new Error("User with ID not found")
        }

        const payload = { userId };
        const secret = process.env.NEXT_JWT_SECRET!;

        const accessTokenoptions: SignOptions = { expiresIn : "15m" };
        const refreshTokenoptions: SignOptions = { expiresIn : "10d" };
        
        const accessToken = jwt.sign(payload, secret, accessTokenoptions);
        const refreshToken = jwt.sign(payload, secret, refreshTokenoptions);

        user.refreshToken = refreshToken
        await user.save()

        return { accessToken , refreshToken }
    } catch (e) {
        console.error(e)
        throw new Error("JWT Token Creation Error")
    }
}

export default GenerateAccessAndRefreshToken