import express from 'express';
import pool from '../database.js';
const router = express.Router();


router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
  res.json(rows);
});

router.get('/:id', async( req, res) => {
  const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({message: 'Notes not found'});
  res.json(rows[0]);
})

router.post('/', async(req, res) => {
  const {title, content} = req.body;
  const [result] = await pool.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)', [title, content, 1]
  );
  res.status(201).json({id: result.insertId, title, content});
})

router.put('/:id', async(req, res) =>{
  const {title, content} = req.body;
  
  await pool.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]
  );
  res.json( {id: req.params.id, title, content});
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
  res.json({message:'Note deleted'});
})

export default router;