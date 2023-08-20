import express from "express"
const router = express.Router()
import multer from "multer"
const uploadMiddleware = multer({ dest: "uploads/"})
import { create, allPosts, post, edit, deleteCat, getByCategory } from "../controllers/posts.js"

// create post
// router.post("/createpost", uploadMiddleware.single('photo'), create)
router.post("/createpost", uploadMiddleware.single('photo'), create)
router.get("/allposts", allPosts)
router.get("/:id", post)
router.put("/edit/:id", uploadMiddleware.single('photo'), edit)
router.delete("/delete/:id", deleteCat)
router.get("/getByCategory/:id", getByCategory)

export default router