import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"

export const authenticate = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies.token
		if (!token) {
			res.status(401)
			throw new Error("Not authorized please login")
			}
			//verify token
			jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
				if (error) return res.status(403).json({ message: error.message });
				req.userId = decoded.userId;
				next()
			})
		} catch (error) {
			res.status(401)
			throw new Error("User not authorized please login")
		}
	})	