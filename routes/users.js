import express from "express"
import { register, login, profile, logout } from "../controllers/auth.js"

const router = express.Router()

// register user
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", profile)

export default router