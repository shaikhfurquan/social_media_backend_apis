import { UserModel } from "../models/userModel.js"

export const createUser = async (req, res) => {
    try {
        const newPostsData = await PostModel
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error creating user",
            error : error.message 
        })
    }
}