import User from "../models/User.js"
import bcrypt from "bcryptjs"

// get a loggedin user
export const getUser = async (req, res) => {
    try {
        const users = await User.findById(req.userId).select("-password")
        return res.status(200).json({ users, status: 'Success', count: users.length })
    } catch(error) {

    }
}