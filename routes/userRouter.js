import express  from "express";
import { createUser, deleteMyProfile, followUser,  getAllUsers, getUserProfileById, loginUser, logoutUser, myProfile, updatePassword, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const userRouter = express.Router();

userRouter.post('/user/register' , createUser)
userRouter.post('/user/login' , loginUser)
userRouter.get('/user/logout' , logoutUser)
userRouter.get('/user/follow/:id' , isAuthenticated , followUser)
userRouter.put('/user/update/password' , isAuthenticated , updatePassword)
userRouter.put('/user/update/profile' , isAuthenticated , updateProfile)
userRouter.delete('/user/delete/me' , isAuthenticated , deleteMyProfile)
userRouter.get('/user/me' , isAuthenticated , myProfile)
userRouter.get('/user/:id' , isAuthenticated , getUserProfileById)
userRouter.get('/user/allusers' , isAuthenticated , getAllUsers)

export default userRouter