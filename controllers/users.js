import User from "../models/User.js"
import bcrypt from "bcryptjs"

export const login = async(req, res) => {
	 const { email, password } = req.body
    //validate email & password
    if (!email || !password) {
        res.status(400)
        throw new Error("Please add email and password")
    } 
    //find user
    const user = await User.findOne({ email })

    if(!user) {
        res.status(400)
        throw new Error("User not found! Please sign up")
    }
    // check password
    const verifyPassword = await bcrypt.compare(password, user.password)
    if (verifyPassword) {
        return res.status(200).status({user})
    } else {
        throw new Error('Please type the correct credentials')
    }
}

// get a loggedin user
export const getUser = async (req, res) => {
    try {
        const users = await User.findById(req.userId).sort({ createdAt: -1} ).limit(5).select("-password") : await User.find().select("-password")
        return res.status(200).json({ users, status: 'Success', count: users.length })
    } catch(error) {

    }
}