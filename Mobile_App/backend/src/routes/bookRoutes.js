import express from "express";
const router = express.Router();
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadResult = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResult.secure_url;

    const book = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });
    await book.save();
    res.status(201).json({ message: "Book created successfully", book });
  } catch (error) {
    console.log("Error creating book:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage ");

    const totalBooks = await Book.countDocuments();
    return res.status(200).json({
      books,
      currentPage: page,
      totalBooks: totalBooks,
      totalBooksPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error fetching books:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Error fetching user's books:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own books" });
    }

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
      }
    }
    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
