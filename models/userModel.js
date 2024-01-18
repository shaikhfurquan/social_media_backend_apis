import mongoose from "mongoose";

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
        unique: [unique, "Email already exists"]
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

export const UserModel = mongoose.Model("User", userSchema)



const mongoose = require('mongoose'); // Erase if already required

