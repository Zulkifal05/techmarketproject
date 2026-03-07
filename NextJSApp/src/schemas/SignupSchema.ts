import z from "zod"

export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePicture: z.string().optional(),
    role: z.enum(["SELLER", "BUYER"], "Role must be either SELLER or BUYER"),
})