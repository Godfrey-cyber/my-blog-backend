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
    res.status(200).json({user})
}