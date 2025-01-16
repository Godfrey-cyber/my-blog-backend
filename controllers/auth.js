import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { createRefreshToken, createAccessToken, validateEmail, validatePassword } from "../middlewares/utilities.js"

// register a user
export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body
        // const userInfo = await User.create( { username, password, email } )

        if (!email || !username || !password) {
            res.status(400)
            throw new Error("Please enter all fiedls")
        } 

        // Validate password format
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // Validate email format
        try {
            validateEmail(email);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        const userExists = await User.findOne({ email })
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const registeredUser = await User.create({
            username,
            password,
            email
        });
        return res.status(201).json({ msg: "User Registration successfull🥇" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
	
}
//login user
export const login = async(req, res) => {
	try {
        const { email, password } = req.body
    //validate email & password
        if (!email || !password) return res.status(400).json({msg: '❌ Please fill in all fields'})

         // Validate password format
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        // Validate email format
        try {
            validateEmail(email);
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }

        //find user
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({msg: "🚫 This email does not exist!"})

        // check password
        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!ifPasswordIsCorrect) return res.status(400).json({ msg: "🚫 Invalid email or password." });

        ////////////////////// Generate tokens ///////////////////
        const accessToken = createAccessToken(userExists._id);
        const refreshToken = createRefreshToken(userExists._id);
        
        ////////////////////// Send refresh token to the front-end /////////////////////////
        res.cookie('refreshToken', refreshToken, {
            path: "/",
            httpOnly: true,
            maxAge: new Date(Date.now() + 1000 * 86400),
            sameSite: "Strict",
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(200).json({ accessToken, msg: "Login successfull🥇" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get users 
export const getUsers = async(req, res) => {
    console.log(req.query.username)
    try{
        const users = req.query.new ? await User.find().sort({ createdAt: -1} ).limit(5).select("-password") : await User.find().select("-password")
        return res.status(200).json({ users, status: 'Success', count: users.length })
    } catch(error) {
        return res.status(500).json({ status: 'Fail', msg: error.message })
    }
}

//
export const profile = async(req, res) => {
	const { token } = req.cookies
	if (!token) {
		return res.status(401).json({ message: "You are not logged in"})
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, data) => {
		if (err) throw err;
		return res.status(200).json({data})
	})
}

// Refresh token
export const tokenRefresh = (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ message: "Refresh token not provided" });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) return res.status(403).json({ message: "Invalid refresh token" });

        const accessToken = createAccessToken(decoded.userId);
        res.status(200).json({ accessToken });
    });
}

//logout
export const logout = async(req, res) => {
	return res.cookie("token", "").json("ok")
}

// this is a great post from the article