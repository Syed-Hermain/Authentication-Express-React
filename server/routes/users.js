import express from 'express';
import pool from '../lib/database.js';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/',protectRoute, async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM users`)
    res.json(rows);
})

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);

export default router;