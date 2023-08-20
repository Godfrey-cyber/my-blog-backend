import express from "express"
const router = express.Router()
import { createCategory, editCategory, getCategories, getCategory, deleteCategory } from "../controllers/categories.js"

router.post("/create", createCategory)
router.get("/getCategories", getCategories)
router.get("/getCategory/:id", getCategory)
router.put("/editCategory/:id", editCategory)
router.delete("/deleteCategory/:id", deleteCategory)

export default router