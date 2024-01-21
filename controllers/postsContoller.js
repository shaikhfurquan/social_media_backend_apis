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


export const deletePost =async  (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }
        
        if(post.owner.toString() !== post.owner.toString()){
            return res.status(404).json({
                success: false,
                message: "Unauthenticated user",
            })

        }
        await post.deleteOne()


        //if we deleted the post then we should also delete the id from user post array
        const user = await UserModel.findById(req.user._id)
        const index = user.posts.indexOf(req.params.id)
        user.posts.splice(index, 1)
        await user.save()

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error while deleting the posts",
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



export const getPostOfFollowing = async (req, res) => {
    try {
        
        const user = await UserModel.findById(req.user._id);
        const post = await PostModel.find({
            owner : {
                $in : user.followings
            }
        })
        console.log(user);


        res.status(200).json({
            success : true,
            post : post 
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Error while fetching the posts",
            error : error.message 
        })
    }
}


export const updateCaption = async (req, res) => {
    try {
       
        const post = await PostModel.findById(req.params.id)

        if(!post) {
            return res.status(404).json({
                success : false,
                message : "Post not found"
            })
        }

        //only owner is allowed to update the caption
        if(post.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({
                success : false,
                message : "Unauthorized user"
            })
        }

        post.caption = req.body.caption
        await post.save()

        return res.status(200).json({
            success: true,
            message: "Post caption updated successfully",
            
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating post caption",
            error: error.message
        })
    }
}