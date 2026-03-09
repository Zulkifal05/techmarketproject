import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { CreateJobSchema } from "@/schemas/JobSchema"
import { verifyJWT } from "@/utils/VerifyJWT"
import { developmentCategories, DevelopmentCategory } from "@/constants/Categories"
import JobModel from "@/models/JobModel"

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
        }

        if(user.role !== "BUYER") {
            return NextResponse.json({ message: "Only buyers can create jobs", success: false }, { status: 403 })
        }

        const body = await req.json()
        const { title, description, categories, jobPrice } = body;

        if (!title || !description || !categories || !jobPrice || jobPrice <= 0 || categories.length === 0) {
            return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
        }

        const validationResult = CreateJobSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors, success: false }, { status: 400 })
        }

        // Validate categories
        for (const category of categories) {
            if (!developmentCategories.includes(category.toLowerCase() as DevelopmentCategory)) {
                return NextResponse.json({ error: `Invalid category: ${category}`, success: false },{ status: 400 })
            }
        }

        const Job = new JobModel({
            title,
            description,
            categories,
            jobPrice,
            uploadedBy: user._id
        })

        await Job.save()

        return NextResponse.json({ message: "Job created successfully", success: true, job: Job }, { status: 201 })

    } catch (error) {
        console.error("Error creating job:", error)

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON in request body", success: false }, { status: 400 })
        }

        return NextResponse.json({ error: "Failed to create job", success: false }, { status: 500 })
    }
}
