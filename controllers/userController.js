import jwt from "jsonwebtoken"
import { UserModel } from "../models/userModel.js"
import { PostModel } from "../models/postsModel.js"
import bcrypt from "bcrypt"
// import { matchPassword } from "../models/matchPassword.js"

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        //If user not found, Registering the user with hashpassword
        const hashpassword = await bcrypt.hash(password, 10)
        user = await UserModel.create({
            name,
            email,
            password: hashpassword,
            avatar: { public_id: "sample_id", url: "sample_url" }
        })

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        const jwtOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(201).cookie("token", token, jwtOptions).json({
            success: true,
            message: `User Register successfully , Welcome ${user.name}`,
            user: user,
            token: token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
            error: "kfl"
        })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found , register first",
            })
        }

        //if we found a user then we will verify his password
        const isMatch = await bcrypt.compare(password, user.password)

        //if password is not match then
        if (!isMatch) return res.status(404).json({
            success: false,
            message: "Invalid Credentials..."
        })

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        const jwtOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(200).cookie("token", token, jwtOptions).json({
            success: true,
            message: `Login Success , Welcome ${user.name}`,
            user: user,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Login user",
            error: error.message
        })
    }
}


export const logoutUser = (req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
            success: true,
            message: `Logout Success`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Logout user",
            error: error.message
        })
    }
}


//following users

export const followUser = async (req, res) => {
    try {
        const userToFollow = await UserModel.findById(req.params.id)
        const loggedInUser = await UserModel.findById(req.user._id)

        console.log("userToFollow=====>", userToFollow);
        console.log("loggedUser=======>", loggedInUser);

        if (!userToFollow) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            })
        }

        //if user already followed by ather then we don't allow to follow them
        if (loggedInUser.following.includes(userToFollow._id)) {

            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id)
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id)

            loggedInUser.following.splice(indexFollowing, 1);
            userToFollow.followers.splice(indexFollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            return res.status(200).json({
                success: true,
                message: "User Unfollowed successfully"
            })

        } else {

            // In our following other user added
            loggedInUser.following.push(userToFollow._id)
            //if I follow the other user then  added his followers
            userToFollow.followers.push(userToFollow._id)

            await loggedInUser.save()
            await userToFollow.save()

            return res.status(200).json({
                success: true,
                message: "User followed successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching the follow user the posts",
            error: error.message
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        // Getting the current login user
        const user = await UserModel.findById(req.user._id).select("+password");
        console.log(user);
        const { oldPassword, newPassword } = req.body;

        // Check if both old and new passwords are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both old and new passwords.',
            });
        }

        // Matching the old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(500).json({
                success: false,
                message: 'Incorrect Old Password',
            });
        }

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating the user password',
            error: error.message,
        });
    }
};



export const updateProfile = async (req, res) => {
    try {
        //getting the current login user
        const user = await UserModel.findById(req.user._id);
        const { name ,email } = req.body

        
        if (name && email) {
            user.name = name
            user.email = email
        }
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating  user profile",
            error: error.message
        })
    }
}


export const deleteMyProfile = async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id);
      const posts = user.posts;
      const followers = user.followers;
      const following = user.following;
      const userId = user._id;
  
  
  
      await user.deleteOne();
  
      // Logout user after deleting profile
  
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
  
      // Delete all posts of the user
      for (let i = 0; i < posts.length; i++) {
        const post = await PostModel.findById(posts[i]);
        await cloudinary.v2.uploader.destroy(post.image.public_id);
        await post.deleteOne();
      }
  
      // Removing User from Followers Following
      for (let i = 0; i < followers.length; i++) {
        const follower = await UserModel.findById(followers[i]);
  
        const index = follower.following.indexOf(userId);
        follower.following.splice(index, 1);
        await follower.save();
      }
  
      // Removing User from Following's Followers
      for (let i = 0; i < following.length; i++) {
        const follows = await UserModel.findById(following[i]);
  
        const index = follows.followers.indexOf(userId);
        follows.followers.splice(index, 1);
        await follows.save();
      }
  
      // removing all comments of the user from all posts
      const allPosts = await PostModel.find();
  
      for (let i = 0; i < allPosts.length; i++) {
        const post = await PostModel.findById(allPosts[i]._id);
  
        for (let j = 0; j < post.comments.length; j++) {
          if (post.comments[j].user === userId) {
            post.comments.splice(j, 1);
          }
        }
        await post.save();
      }
     
         res.status(200).json({
            success: true,
            message: "User profile deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting user profile",
            error: error.message
        })
    }
}


export const myProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate("posts")

        res.status(200).json({
            success: true,
            user : user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error showing login user profile",
            error: error.message
        })
    }
}


export const getUserProfileById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).populate("posts")

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user : user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error showing user profile",
            error: error.message
        })
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await UserModel.find()
        res.status(200).json({
            success: true,
            allUsers
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while showing All users profile",
            error: error.message
        })
    }
}

