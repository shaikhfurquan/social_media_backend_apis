import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';


dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

//express middleware
app.use(express.json());


//Database configuration
connectDB()


app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});

