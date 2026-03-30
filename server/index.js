import express from 'express';
import cors from 'cors';
import noteRoutes from './routes/notes.js';
import userRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello world!");
})

app.use('/notes', noteRoutes);
app.use('/users', userRoutes);

app.listen(8000, ()=>{
    console.log("Server is listening");
})