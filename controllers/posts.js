import multer from "multer"
import Post from "../models/Posts.js"
import Category from "../models/Category.js"
const uploadMiddleware = multer({ dest: "uploads/"})
import fs from "fs"
import jwt from "jsonwebtoken"

export const create = async (req, res) => {
	// -----------handling img-----------------
	const { originalname, path } = req.file
	const name = originalname.split('.')
	const extension = name[name.length - 1]
	const imagePath = `${path}.${extension}`
	fs.renameSync(path, imagePath)
// ----------- verifying token -----------------
	const { token } = req.cookies
	if (!token) {
		return res.status(401).json("Not authorized please login")
		// throw new Error("Not authorized please login")
	}
	jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
		if (err) throw err;
			const { title, summary, content, catId, catName } = req.body
			// ----------- creating post doc & pushing it to the category -----------------
			const categoryDoc = await Category.findById(catId)
			try {
				const post = await Post.create({
					title,
					summary,
					content,
					catId,
					catName: categoryDoc.name,
					author: data.id,
					photo: imagePath
				})
				try {
					await Category.findByIdAndUpdate(catId, {$push: { blogId: post._id}})
				} catch (error) {
					res.status(400).json({ msg: error })
				}
				 res.status(200).json({data: {post, status: 200, statusText: "ok"}})
			} catch (error) {
				res.status(400).json(error)
			}
	// 	res.status(200).json(postst)
	})
}

// ----------------ignore this---------------
// export const createRoom = async (req, res, next) => {
//     const hotelId = req.params.hotelId
//     const newRoom = new Room(req.body)

//     try {
//         const savedRoom = await newRoom.save()
//         try {
//             await Hotel.findByIdAndUpdate(hotelId, {$push:{ rooms: savedRoom._id}})
//         } catch (error) {
//             next(error)
//         }
//         res.status(200).json({data: {savedRoom, status: 200}})
//     } catch (error) {
//         next(error)s
//     }
// }

// ----------------ignore this---------------

export const allPosts = async(req, res) => {
	try {
		const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20)
		res.status(200).json(posts)
	} catch (err) {
		res.status(400).json({ msg: "Something went wrong" })
	}
}

export const post = async (req, res) => {
	try {
		const { id } = req.params
		const post = await Post.findById(id).populate('author', ['username'])
		res.status(200).json(post)
	} catch(err) {
		res.status(400).json({ msg: "There was an error in completing the request... Please try again later"})
	}
}
// <--------------edit post-------------------> 
export const edit = async (req, res) => {
	let imagePath = null
	if (req.file) {
		const { originalname, path } = req.file
		const name = originalname.split('.')
		const extension = name[name.length - 1]
		imagePath = path+'.'+extension
		fs.renameSync(path, imagePath)
	}

	const { token } = req.cookies
	console.log(token)
	console.log(req.body)
	if (!token) {
		return res.status(401).json({ error: "Not authorized please login"})
	}

	jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
		if (err) throw err;
		const { id, title, summary, content, catId, catName } = req.body
		const categoryDoc = await Category.findById(catId)
		const postDoc = await Post.findById(id)
		const checkAuth = JSON.stringify(postDoc.author) === JSON.stringify(data.id)
		if (!checkAuth) {
			return res.status(400).json({ msg: "You are not authorized to edit this post..."})
		}
		try {
			const updatedProduct = await Post.findByIdAndUpdate(id, {$set: {
			title,
			summary,
			content,
			catId,
			catName: categoryDoc.name,
			author: data.id,
			photo: imagePath ? imagePath : postDoc.photo,
		}}, {new: true})
		try {
			const checkId = req.body.catId === postDoc.catId
			console.log(checkId)
			if(!checkId) {
			    await Category.findByIdAndUpdate(catId, {$push: { blogId: updatedProduct._id}})
			}
		} catch (error) {
			res.status(400).json({ msg: error })
		}	
		res.status(200).json(updatedProduct)
		} catch (error) {
			return res.status(400).json({ msg: error })
		}
	})
}

export const deleteCat = async (req, res) => {
	const { token } = req.cookies
	console.log(token)
	if (!token) {
		return res.status(401).json({ error: "Not authorized please login"})
	}

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
		if (err) throw err;
		const catId = req.params.id
		try {
			await Post.findByIdAndDelete(req.params.id)
        	res.status(200).json({msg: "Post has been deleted"})
		} catch (error) {
			res.status(401).json({error: error, status: 401 })
		}
	})
}

// GET POSTS BY CATEGORY
export const getByCategory = async (req, res) => {
	try {
		const products = await Post.find({ catId: req.params.id }).populate('author', ['username']).sort({createdAt: -1}).limit(20)
        res.status(200).json({ data: products, status: 200, statusText: "ok" })
	} catch(error) {
		res.status(401).json({error: error, status: 401 })
	}
}

// export const getHotelRooms = async (req, res, next) => {
//     try {
//         const hotel = await Hotel.findById(req.params.id)

//         const list = await Promise.all(hotel.rooms.map(room => {
//             return Room.findById(room)
//         }))

//         res.status(200).json(list)
//     } catch (error) {
//         next(error)
//     }
// }

// export const getByCategory = asyncHandler(async(req, res) => {
//     try {
//         const products = await Product.find({ catId: req.params.id })
//         res.status(200).json({ data: products })
//     } catch (err) {
//         res.status(400).json({message: err})
//     }
// })