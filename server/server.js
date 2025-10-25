import { configDotenv } from 'dotenv';
configDotenv()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/routes.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
mongoose.set('strictQuery', true);
app.use(cors({
    origin: true,
    optionsSuccessStatus: 204,
    credentials: true
}));

app.use("", router);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected To Database...");
        app.listen(port, () => {
            console.log(`Listening at PORT ${port}`);
        });
    } catch (err) {
        console.log("Error : ", err.message);
    }
};

startServer();