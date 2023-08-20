import Category from "../models/Category.js"

export const addToCategory = async (req, res, next) => {
    // const categoryId = req.params.hotelId
    // const categoryId = req.body.blogs
    // const newCategory = new Category(req.body)

    // try {
    //     const savedCategory = await newCategory.save()
    //     try {
    //         await Hotel.findByIdAndUpdate(hotelId, {$push:{ rooms: savedCategory._id}})
    //     } catch (error) {
    //         next(error)
    //     }
    //     res.status(200).json({data: {savedCategory, status: 200}})
    // } catch (error) {
    //     next(error)
    // }
}

export const createCategory = async (req, res) => {
    const { token } = req.cookies
    console.log(token)
    // if (!token) {
    //     return res.status(401).json({ error: "Not authorized please login"})
    // }
    
    // jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    //     if (err) throw err;
        const { name, desc } = req.body
        try {
            const newCat = new Category({
            name: req.body.name,
            desc: req.body.desc,
        })
        const savedCat = await newCat.save()
        res.status(200).json({ data: savedCat, status: 200, statusText: "ok" })
        console.log(savedCat)
        } catch (error) {
            res.status(401).json({data: { error, status: 401 }})
        }
    // })
}

export const getCategories = async (req, res) => {
	try {
        const categories = await Category.find()
        res.status(200).json({ data: categories, status: 200, statusText: "ok" })
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

// GET CATEGORY
export const getCategory = async (req, res) => {
	try {
		const { id } = req.params
        const category = await Category.findById(id)
        res.status(200).json({ data: category, status: 200, statusText: "ok" })
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

export const editCategory = async (req, res) => {
    const { token } = req.cookies
    // if (!token) {
    //     return res.status(401).json({ error: "Not authorized please login"})
    // }

    // jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    //     if (err) throw err;
        const { name, blogId, desc } = req.body
        
        try {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {$set: {
            name,
            blogId,
            desc,
        }}, {new: true})

        res.status(200).json(updatedCategory)
        } catch (error) {
            return res.status(400).json({ msg: error })
        }
        
    // })
}

// delete category
export const deleteCategory = async (req, res) => {
    const catId = req.params.id
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Category has been deleted"})
    } catch (error) {
        res.status(401).json({error: error, status: 401 })
    }
}