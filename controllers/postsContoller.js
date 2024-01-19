import { PostModel } from "../models/postsModel.js"

export const createPosts = async (req, res, next) => {
    try {
        const newPostsData = await PostModel
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error creating posts",
            error : error.message 
        })
    }
}
  