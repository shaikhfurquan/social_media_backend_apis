import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import postsRouter from './routes/postsRouter.js';
import userRouter from './routes/userRouter.js';


dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

//express middleware
app.use(express.json());


//routes
app.use('/api/v1/' , postsRouter)
app.use('/api/v1/' , userRouter)

//Database configuration
connectDB()


app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});

