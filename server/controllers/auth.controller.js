import pool from "../lib/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const checkAuth = async( req, res) =>{
  const { id, name, email } = req.user;
  res.json({ id, name, email });
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
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    const userId = result[0].insertId;

    generateToken(userId, res);

    res
      .status(201)
      .json({ id: userId, name, email });
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
    generateToken(rows[0].id, res);
    res
      .status(201)
      .json({ id: rows[0].id, name: rows[0].name, email: rows[0].email });
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
  try{
    const {profilePicture} = req.body;
    
    if(!profilePicture){
      return res.status(400).json({message: "Profile picture is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture)

  } catch(error){
    // console.error(error); 
    res.status(500).json({message: "Server error"});
  }
}