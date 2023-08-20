import mongoose from 'mongoose'
import { Schema } from "mongoose"
import bcrypt from "bcryptjs"

const postModelSchema = mongoose.Schema({
    title: { type: String, unique: true },
    summary: { type: String, required: true },
    photo: { type: String },
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    catId: { type: String },
    catName: { type: String }
}, { timestamps: true } )

//encrypt password before saving

export default mongoose.model("Post", postModelSchema)
