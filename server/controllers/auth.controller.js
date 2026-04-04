import pool from "../lib/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import dotenv from 'dotenv';
dotenv.config();

export const checkAuth = async( req, res) =>{
  const { id, name, email, role, profile_pic } = req.user;
  res.json({ id, name, email, role, profile_pic });
}


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
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"],
    );
    /*
    const userId = result[0].insertId;

    generateToken(userId, res);

    res
      .status(201)
      .json({ id: userId, name, email });
      */
     res.status(201)
  } catch (err) {
    console.error(err); // ✅ log the actual error so you can see what's happening
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // login logic here

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const isPasswordValid = await bcrypt.compare(
      password,
      rows[0].password_hash,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If we get here, the user is authenticated
    // You can generate a token or perform other actions here
    generateToken(rows[0].id, rows[0].role, res);
    res
      .status(201)
      .json({ id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role, profile_pic: rows[0].profile_pic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body; // "users/user_1"

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    await pool.query('UPDATE users SET profile_pic = ? WHERE id = ?',
      [profilePicture, req.user.id]
    );

    res.json({ message: "Profile updated successfully", profilePicture });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export const getSignedUrl = async (req, res) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp: timestamp, folder: "users", public_id: `user_${req.user.id}`, },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    folder: "users",
    public_id: `user_${req.user.id}`,
    cloudname: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY
  });
};