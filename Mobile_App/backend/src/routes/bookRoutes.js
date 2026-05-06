import express from 'express';
const router = express.Router();
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';

router.post('/', async (req, res) => {
    try {
        const { title,caption,image,rating } = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }

            const uploadResult = await cloudinary.uploader.upload(image);
            const imageUrl = uploadResult.secure_url;
            res.status(200).json({ message: 'Book created successfully', imageUrl });

            const book = new Book({
                title,
                caption,
                image: imageUrl,
                rating,
                user: req.user._id
            });
            await book.save();
            res.status(201).json({ message: 'Book created successfully', book });
    } catch (error) {
        
    }
});