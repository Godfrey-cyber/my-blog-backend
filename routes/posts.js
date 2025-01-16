import express from "express"
const router = express.Router()
import multer from "multer"
const uploadMiddleware = multer({ dest: "uploads/"})
import { authenticate } from "../middlewares/authMiddleware.js"
import { create, allPosts, post, edit, deleteCat, getByCategory } from "../controllers/posts.js"

// create post
// router.post("/createpost", uploadMiddleware.single('photo'), create)
router.post("/createpost", authenticate, uploadMiddleware.single('photo'), create)
router.get("/allposts", allPosts)
router.get("/:id", authenticate, post)
router.put("/edit/:id", authenticate, uploadMiddleware.single('photo'), edit)
router.delete("/delete/:id", authenticate, deleteCat)
router.get("/getByCategory/:id", getByCategory)

export default router