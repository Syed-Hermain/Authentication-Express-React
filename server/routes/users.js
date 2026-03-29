import express from 'express';
import pool from '../lib/database.js';
import { signup } from '../controllers/auth.controller.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/utils.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM users`)
    res.json(rows);
})

router.post('/signup', async (req, res) => {
    console.log(req.body);
    signup(req, res);
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // login logic here

    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});
    }
    try{
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const isPasswordValid = await bcrypt.compare(password, rows[0].password_hash);

        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid email or password"});
        }

        // If we get here, the user is authenticated
        // You can generate a token or perform other actions here
        generateToken(rows[0].id, res);
        res.status(200).json({message: `Login successful with user id ${rows[0].id}`});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({message: "Logged out successfully"});
})

export default router;