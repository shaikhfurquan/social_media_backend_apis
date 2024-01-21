import express  from "express";
import { createUser, followUser, loginUser, logoutUser, updatePassword, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const userRouter = express.Router();

userRouter.post('/user/register' , createUser)
userRouter.post('/user/login' , loginUser)
userRouter.get('/user/logout' , logoutUser)
userRouter.get('/user/follow/:id' , isAuthenticated , followUser)
userRouter.put('/user/update/password' , isAuthenticated , updatePassword)
userRouter.put('/user/update/profile' , isAuthenticated , updateProfile)

export default userRouter