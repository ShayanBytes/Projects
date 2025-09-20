const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const { auth } = require("../middleware/auth");
const EventHistoryService = require("../services/EventHistoryService");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("registeredEvents", "title date time location organizer")
      .populate({
        path: "registeredEvents",
        populate: {
          path: "organizer",
          select: "name organizationName",
        },
      });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "organizationName",
      "contactInfo",
      "eventTypes",
      "interests",
      "location",
    ];
    const updates = {};

    // Filter only allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's registered events (any authenticated user)
router.get("/registered-events", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "registeredEvents",
      populate: {
        path: "organizer",
        select: "name organizationName email contactInfo",
      },
    });

    res.json({
      registeredEvents: user.registeredEvents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's complete event history
router.get("/history", [auth], async (req, res) => {
  try {
    const { page, limit, action, startDate, endDate } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      action,
      startDate,
      endDate,
    };

    const result = await EventHistoryService.getUserHistory(
      req.user._id,
      options
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's activity statistics
router.get("/history/stats", [auth], async (req, res) => {
  try {
    const stats = await EventHistoryService.getUserStats(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
