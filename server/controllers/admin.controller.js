import pool from "../lib/database.js";


export const getAllUsers = async (req, res) => {
    const [rows] = await pool.query(`SELECT id, name, email, role FROM users`)
    res.json(rows);
}