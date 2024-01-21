import express  from "express";
import { createUser, followUser, loginUser } from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const userRouter = express.Router();

userRouter.post('/user/register' , createUser)
userRouter.post('/user/login' , loginUser)
userRouter.get('/user/follow/:id' , isAuthenticated , followUser)

export default userRouter