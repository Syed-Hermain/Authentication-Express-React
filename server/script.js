import jwt from 'jsonwebtoken';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJpYXQiOjE3NzQ3ODcxOTIsImV4cCI6MTc3NDk1OTk5Mn0.NJgu5lGGPkBLC0m61NX_aI7HVdsZ0gm4atrYd9DHnB8";

  
  const decoded = jwt.verify(token, "mysecretkey");


  if (decoded) {
    console.log("Decoded token:", decoded.userId);
  } else {
    console.log("Invalid token");
  }

  console.log