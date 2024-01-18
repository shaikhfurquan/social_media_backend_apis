import mongoose from "mongoose";


const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log(`Connecting to ${process.env.MONGO_URL} successfully`);
    }).catch((err) =>{
        console.log('Error connecting to db' , err.message);
    })
}

export default connectDB