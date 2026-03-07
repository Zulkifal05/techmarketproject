import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import UserModel from "@/models/UserModel"
import { connectDB } from "@/utils/ConnectDB"
import { SignupSchema } from "@/schemas/SignupSchema"

export async function POST(req: Request) {
    await connectDB()

    try {
        const body = await req.json()
        
        const validationResult = SignupSchema.safeParse(body)
        
        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors, success : false }, { status: 400 })
        }

        const existingUser = await UserModel.findOne({ email: body.email })
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use", success : false }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)

        if(body.profilePicture) {  // If profile picture is provided, include it in the user creation
            const newUser = new UserModel({
                name: body.name,
                email: body.email,
                password: hashedPassword,
                profilePicture: body.profilePicture,
                role: body.role,
            })
            await newUser.save()

            const userObject = newUser.toObject()
            delete userObject.password  // Remove password from the response

            return NextResponse.json({ message: "User created successfully", success : true, user: userObject }, { status: 201 })
        } else {  // If no profile picture, create user without it
            const newUser = new UserModel({
                name: body.name,
                email: body.email,
                password: hashedPassword,
                role: body.role,
            })
            await newUser.save()

            const userObject = newUser.toObject()
            delete userObject.password  // Remove password from the response

            return NextResponse.json({ message: "User created successfully", success : true, user: userObject }, { status: 201 })
        }
        
    } catch (error) {
        console.error("Error creating user:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON format", success : false }, { status: 400 })
        }

        return NextResponse.json({ error: "Failed to create user" , success : false }, { status: 500})
    }
}