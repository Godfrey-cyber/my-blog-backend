import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"


const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "1d"})
}
// register user
export const register = async (req, res) => {
	const { username, password, email } = req.body
	// const userInfo = await User.create( { username, password, email } )

	if (!email || !username || !password) {
        res.status(400)
        throw new Error("Please enter all fiedls")
    } 

    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be more than 6 characters");
    } 

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("There exists a user registered with that email already")
    } 

    const registeredUser = await User.create({
        username,
        password,
        email
    });
	return res.status(200).json({ data: registeredUser })
}
//login user
export const login = async(req, res) => {
	 const { email, password } = req.body
    //validate email & password
    if (!email || !password) {
        return res.status(400).json("Please add email and password")
    } 
    //find user
    const user = await User.findOne({ email })

    if(!user) {
        return res.status(400).json("User not found! Please sign up")
    }
    // check password
    const verifyPassword = await bcrypt.compare(password, user.password)
    // assign a token
    const token = generateToken(user._id, user.username)
       return res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
       })
    if (user && verifyPassword) {
        const {_id, username, email } = user
        return res.status(200).json({data: {_id, username, email, token }})
    } else {
        res.status(400)
        throw new Error("Invalid email or password!")
    }
}

//
export const profile = async(req, res) => {
	const { token } = req.cookies
	if (!token) {
		return res.status(401).json({ message: "You are not logged in"})
	}
	jwt.verify(token, process.env.JWT_SECRET, {}, (err, data) => {
		if (err) throw err;
		return res.status(200).json({data})
	})
}

//logout
export const logout = async(req, res) => {
	return res.cookie("token", "").json("ok")
}

// this is a great post from the article