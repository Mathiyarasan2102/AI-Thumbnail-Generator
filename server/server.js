import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import session from 'express-session'
import MongoStore from 'connect-mongo'

await connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    })

}))

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is Live!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});