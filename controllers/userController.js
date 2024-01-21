import jwt from "jsonwebtoken"
import { UserModel } from "../models/userModel.js"
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
        if (loggedInUser.followings.includes(userToFollow._id)) {

            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id)
            const indexFollowing = loggedInUser.followings.indexOf(userToFollow._id)

            loggedInUser.followings.splice(indexFollowing, 1);
            userToFollow.followers.splice(indexFollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            return res.status(200).json({
                success: true,
                message: "User Unfollowed successfully"
            })
            
        }else{

            // In our following other user added
            loggedInUser.followings.push(userToFollow._id)
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