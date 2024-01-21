import jwt from "jsonwebtoken"
import { UserModel } from "../models/userModel.js"


export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login."
            })
        }

        // console.log(token);
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
       console.log(decoded);

        //if user is login we will store the data of user in the req.user
        req.user = await UserModel.findById(decoded._id)
        // console.log("req.....user==>", req.user);

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            eeror : "jhdsfk"
        })
    }
}
