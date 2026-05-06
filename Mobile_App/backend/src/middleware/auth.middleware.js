import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const response = await fetch('http://localhost:3000/api/books', {
  method: 'POST',
  body: JSON.stringify({
    title,
    caption
    }),
    headers : {athorization: `Bearer ${token}`},
});

 const protectRoute = async (req, res, next) => {

    try {
        const token = req.headers('authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized Access' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    } catch (error) {
        
    }
};

export default protectRoute;