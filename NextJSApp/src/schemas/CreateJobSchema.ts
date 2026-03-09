import z from "zod"
import { developmentCategories, DevelopmentCategory } from "@/constants/Categories"

export const CreateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string().refine((val) => developmentCategories.includes(val as DevelopmentCategory), {
    message: "Invalid category"
  })).min(1, "At least one category is required"),
  jobPrice: z.number().min(0, "Job price must be a positive number")
})