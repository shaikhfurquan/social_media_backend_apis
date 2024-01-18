import express  from "express";
import { createUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/users/create' , createUser)

export default userRouter