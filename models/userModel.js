import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"]
    },

    avatar: {
        public_id: String,
        url: String
    },

    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: [true, "Email already exists"]
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "password must be at least 6 characters"],
        select: false,
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})





export const UserModel = mongoose.model("User", userSchema)



