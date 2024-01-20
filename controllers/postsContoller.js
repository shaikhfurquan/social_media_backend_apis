import { PostModel } from "../models/postsModel.js"
import { UserModel } from "../models/userModel.js"

export const createPosts = async (req, res) => {
    try {
      
        const newPostData = {
            caption : req.body.caption,
            image : {
                public_id : "req.body.public_id",
                url : "req.body.url"
            },
            owner : req.user._id
        }

        const post = await PostModel.create(newPostData)
        const user = await UserModel.findById(req.user._id)

        user.posts.push(post._id)
        await user.save()

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: post
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error while creating posts",
            error : error.message 
        })
    }
}


export const likeAndUnlikePost = async (req, res) =>{
    try {

        const post = await PostModel.findById(req.params.id)

        //if someone giving not a valid id the
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Invalid Post"
            })
        }

        //if post already like then 
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id)
            post.likes.splice(index, 1)

            await post.save()
            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        }else{
            // pushing the login userId in like array
            post.likes.push(req.user.id)
            await post.save()
            return res.status(200).json({
                success: true,
                message: "Post Liked"
            })

        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error like and unlike the posts",
            error : error.message 
        })
    }
}


export const deletePost = (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error while deleting the posts",
            error : error.message 
        })
    }

}