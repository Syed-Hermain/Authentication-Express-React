import express from 'express';
import cors from 'cors';
const app = express();
import noteRoutes from './routes/notes.js';
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello world!");
})

app.use('/notes', noteRoutes);

app.listen(8000, ()=>{
    console.log("Server is listening");
})