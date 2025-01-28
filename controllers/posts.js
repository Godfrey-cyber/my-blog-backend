import multer from "multer"
import Post from "../models/Posts.js";
import Category from "../models/Category.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// Initialize multer for handling file uploads
const uploadMiddleware = multer({ dest: "uploads/" });

export const create = async (req, res) => {
	try {
	    // ----------- Handling image -----------------
	    if (!req.file) {
	      	return res.status(400).json({ msg: "No image file uploaded." });
	    }

	    const { originalname, path } = req.file;
	    const extension = originalname.split('.').pop(); // Safely get file extension
	    const imagePath = `${path}.${extension}`;

	    // Rename the file asynchronously to avoid blocking event loop
	    fs.rename(path, imagePath, (err) => {
		    if (err) {
		        return res.status(500).json({ msg: "Error renaming file", error: err });
		    }
	    });

	    // ----------- Verifying token -----------------
	    const { token } = req.cookies;
	    if (!token) {
	      	return res.status(401).json({ msg: "Not authorized, please login" });
	    }
	    // ----------- Creating post & linking to category -----------------
	    const { title, summary, content, catId, catName } = req.body;

	    // Validate category
	    const categoryDoc = await Category.findById(catId);
	    if (!categoryDoc) {
	      	return res.status(400).json({ msg: "Category not found" });
	    }

	    // Create the post document
	    const post = await Post.create({
		    title,
		    summary,
		    content,
		    catId,
		    catName: categoryDoc.name,
		    author: req.userId,
		    photo: imagePath,
	    });

	    // Link the post to the category
	    await Category.findByIdAndUpdate(catId, {
	      	$push: { blogId: post._id },
	    });

	    // Return success response
	    return res.status(200).json({
		    data: {
		        post,
		        status: 200,
		        statusText: "OK",
		    },
	    });
	} catch (error) {
	    console.error("Error creating post:", error);
	    return res.status(500).json({ msg: error.message || "Internal server error"  });
	}
};

export const allPosts = async(req, res) => {
	try {
		const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20)
		return res.status(200).json(posts)
	} catch (err) {
		return res.status(400).json({ msg: error.message })
	}
}

export const post = async (req, res) => {
	try {
		const { id } = req.params
		const post = await Post.findById(id).populate('author', ['username'])
		return res.status(200).json(post)
	} catch(err) {
		return res.status(400).json({ msg: err.message})
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

	try {
		const updatedProduct = await Post.findByIdAndUpdate(id, {$set: {
		title,
		summary,
		content,
		catId,
		catName: categoryDoc.name,
		author: req.userId,
		photo: imagePath ? imagePath : postDoc.photo,
	}}, {new: true})
	try {
		const checkId = req.body.catId === postDoc.catId
		console.log(checkId)
		if(!checkId) {
		    await Category.findByIdAndUpdate(catId, {$push: { blogId: updatedProduct._id}})
		}
	} catch (error) {
		return res.status(400).json({ msg: error })
	}	
	return res.status(200).json(updatedProduct)
	} catch (error) {
		return res.status(400).json({ msg: error })
	}
}

export const deleteCat = async (req, res) => {
	const catId = req.params.id
	try {
		await Post.findByIdAndDelete(req.params.id)
    	return res.status(200).json({msg: "Post has been deleted"})
	} catch (error) {
		return res.status(401).json({error: error, status: 401 })
	}
}

// GET POSTS BY CATEGORY
export const getByCategory = async (req, res) => {
	try {
		const products = await Post.find({ catId: req.params.id }).populate('author', ['username']).sort({createdAt: -1}).limit(20)
        return res.status(200).json({ data: products, status: 200, statusText: "ok" })
	} catch(error) {
		return res.status(401).json({error: error, status: 401 })
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