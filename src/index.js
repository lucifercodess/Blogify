import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//file imports
import { connectDb } from './config/db.config.js';
import authRoute from './routes/user.route.js'
import blogRoute from './routes/blog.route.js'
// app
const app = express();

// config for environment variables
dotenv.config();

//middlwares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(morgan('dev'));
app.use(cookieParser({
  credentials: true
}));

//routes
app.use('/api/auth',authRoute);
app.use('/api/blog',blogRoute);



// server listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
