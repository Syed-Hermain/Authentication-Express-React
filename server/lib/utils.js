import jwt from 'jsonwebtoken';

export const generateToken =(userId, role, res) =>{
    const token = jwt.sign({userId, role}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    })
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development' // only send cookie over HTTPS in production
    })

    return token;  
}