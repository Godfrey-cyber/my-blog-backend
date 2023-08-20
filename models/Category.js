import mongoose from 'mongoose'
import { Schema } from "mongoose"

const categoryModelSchema = mongoose.Schema({
    name: { type: String, unique: true },
    blogId: { type: [String] },
    desc: { type: String, required: true },
    // photo: { type: String },
    // content: { type: String },
    // author: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true } )

//encrypt password before saving

export default mongoose.model("Category", categoryModelSchema)
