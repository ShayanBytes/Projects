const mongoose = require("mongoose");

const eventHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "registered", "unregistered"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Store event details at time of action (in case event is deleted later)
    eventSnapshot: {
      title: String,
      eventType: String,
      date: Date,
      location: String,
      organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      organizerName: String,
    },
    // Additional metadata
    metadata: {
      userRole: String,
      userAgent: String,
      ipAddress: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
eventHistorySchema.index({ user: 1, timestamp: -1 });
eventHistorySchema.index({ event: 1, timestamp: -1 });
eventHistorySchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model("EventHistory", eventHistorySchema);
