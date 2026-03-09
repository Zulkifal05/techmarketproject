import mongoose from "mongoose"
import { developmentCategories, DevelopmentCategory } from "@/constants/Categories"

interface Job {
    title: string,
    description: string,
    uploadedBy: mongoose.Types.ObjectId,
    categories: DevelopmentCategory[],
    jobPrice: number
}

const JobSchema = new mongoose.Schema<Job>(
    {
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    uploadedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "UploadedBy is required"]
    },
    categories: [
        { 
            type: String,
            enum: developmentCategories,
            required: [true, "At least one category is required"],
            validate: {
                validator: (arr: string[]) => arr.length > 0,
                message: "At least one category is required"
            }
        }
    ],
    jobPrice: {
        type: Number,
        required: [true, "Job price is required"],
        min: [0, "Job price must be a positive number"]
    }
    },{timestamps: true})

const JobModel = mongoose.models.Job || mongoose.model<Job>("Job", JobSchema)

export default JobModel