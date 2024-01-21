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
            expires : new Date(Date.now() + 90 *24 * 60 *60 * 1000),
            httpOnly : true,
        }

        res.status(201).cookie("token", token , jwtOptions).json({
            success: true,
            message : `User Register successfully , Welcome ${user.name}`,
            user: user,
            token: token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
            error : "kfl"
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
            expires : new Date(Date.now() + 90 *24 * 60 *60 * 1000),
            httpOnly : true,
        }

        res.status(200).cookie("token", token , jwtOptions).json({
            success: true,
            message : `Login Success , Welcome ${user.name}`,
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