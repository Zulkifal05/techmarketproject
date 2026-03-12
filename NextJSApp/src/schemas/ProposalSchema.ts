import z from "zod"
import { Types } from "mongoose"

export const CreateProposalSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    Bid: z.number().min(0, "Bid must be a positive number"),
    ProposalFor: z.string().refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId for ProposalFor"
    }),
})