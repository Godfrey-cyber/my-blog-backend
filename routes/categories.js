import express from "express"
import { authenticate } from "../middlewares/authMiddleware.js"
import { createCategory, editCategory, getCategories, getCategory, deleteCategory } from "../controllers/categories.js"
const router = express.Router()
router.post("/create", authenticate, createCategory)
router.get("/getCategories", getCategories)
router.get("/getCategory/:id", getCategory)
router.put("/editCategory/:id", authenticate, editCategory)
router.delete("/deleteCategory/:id", authenticate, deleteCategory)

export default router