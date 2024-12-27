import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js'
import authRoutes from './routes/authRoute.js'


dotenv.config();


mongoose
.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("MongoDb is connected");
    })
    .catch((err)=>{
        console.log(err.message);
    });

const app = express();

// Allow to send JSON to the backend 
app.use(express.json());
    
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);