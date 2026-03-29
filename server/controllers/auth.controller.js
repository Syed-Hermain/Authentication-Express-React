import pool from "../lib/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // ✅ no callback, just await
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    const userId = result[0].insertId;

    generateToken(userId, res);

    res.status(201).json({ message: `User created successfully with id ${userId}` });
  } catch (err) {
    console.error(err); // ✅ log the actual error so you can see what's happening
    res.status(500).json({ message: "Server error" });
  }
};
