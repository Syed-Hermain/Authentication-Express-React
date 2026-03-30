import jwt from 'jsonwebtoken';
import pool from '../lib/database.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        //  console.log('jwt cookie:', req.cookies?.jwt);
        //  console.log('headers:', req.headers);
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
      
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }

        const user = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);

        // console.log('User query result:', user[0]);
        if(!user[0].length){
            return res.status(401).json({message: "Unauthorized"});
        }

        req.user = user[0][0];

        console.log('Authenticated user:', req.user);

        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized - invalid"});
    }
}