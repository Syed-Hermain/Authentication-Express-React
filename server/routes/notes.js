import express from 'express';
import pool from '../database.js';
const router = express.Router();


router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
  res.json(rows);
});

export default router;