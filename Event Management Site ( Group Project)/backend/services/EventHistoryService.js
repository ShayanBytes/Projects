const EventHistory = require("../models/EventHistory");

class EventHistoryService {
  // Log when an event is created
  static async logEventCreation(userId, event, req = null) {
    try {
      await EventHistory.create({
        user: userId,
        event: event._id,
        action: "created",
        eventSnapshot: {
          title: event.title,
          eventType: event.eventType,
          date: event.date,
          location: event.location,
          organizer: event.organizer,
          organizerName: event.organizer?.name || "Unknown",
        },
        metadata: {
          userRole: "organizer",
          userAgent: req?.headers["user-agent"] || "",
          ipAddress: req?.ip || req?.connection?.remoteAddress || "",
        },
      });
    } catch (error) {
      console.error("Error logging event creation:", error);
    }
  }

  // Log when someone registers for an event
  static async logEventRegistration(userId, event, userRole, req = null) {
    try {
      // Get organizer name if available
      let organizerName = "Unknown";
      if (event.organizer) {
        if (typeof event.organizer === "object" && event.organizer.name) {
          organizerName = event.organizer.name;
        } else {
          // If organizer is just an ID, we might need to populate it
          const User = require("../models/User");
          const organizer = await User.findById(event.organizer).select("name");
          organizerName = organizer?.name || "Unknown";
        }
      }

      await EventHistory.create({
        user: userId,
        event: event._id,
        action: "registered",
        eventSnapshot: {
          title: event.title,
          eventType: event.eventType,
          date: event.date,
          location: event.location,
          organizer: event.organizer,
          organizerName,
        },
        metadata: {
          userRole,
          userAgent: req?.headers["user-agent"] || "",
          ipAddress: req?.ip || req?.connection?.remoteAddress || "",
        },
      });
    } catch (error) {
      console.error("Error logging event registration:", error);
    }
  }

  // Log when someone unregisters from an event
  static async logEventUnregistration(userId, event, userRole, req = null) {
    try {
      // Get organizer name if available
      let organizerName = "Unknown";
      if (event.organizer) {
        if (typeof event.organizer === "object" && event.organizer.name) {
          organizerName = event.organizer.name;
        } else {
          const User = require("../models/User");
          const organizer = await User.findById(event.organizer).select("name");
          organizerName = organizer?.name || "Unknown";
        }
      }

      await EventHistory.create({
        user: userId,
        event: event._id,
        action: "unregistered",
        eventSnapshot: {
          title: event.title,
          eventType: event.eventType,
          date: event.date,
          location: event.location,
          organizer: event.organizer,
          organizerName,
        },
        metadata: {
          userRole,
          userAgent: req?.headers["user-agent"] || "",
          ipAddress: req?.ip || req?.connection?.remoteAddress || "",
        },
      });
    } catch (error) {
      console.error("Error logging event unregistration:", error);
    }
  }

  // Get user's event history
  static async getUserHistory(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        action = null,
        startDate = null,
        endDate = null,
      } = options;

      const query = { user: userId };

      if (action) {
        query.action = action;
      }

      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;

      const [history, total] = await Promise.all([
        EventHistory.find(query)
          .populate(
            "event",
            "title eventType date location currentAttendees maxAttendees"
          )
          .populate("user", "name email")
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        EventHistory.countDocuments(query),
      ]);

      return {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Error fetching user history: " + error.message);
    }
  }

  // Get event's registration history
  static async getEventHistory(eventId, options = {}) {
    try {
      const { page = 1, limit = 20, action = null } = options;

      const query = { event: eventId };

      if (action) {
        query.action = action;
      }

      const skip = (page - 1) * limit;

      const [history, total] = await Promise.all([
        EventHistory.find(query)
          .populate("user", "name email role")
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        EventHistory.countDocuments(query),
      ]);

      return {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Error fetching event history: " + error.message);
    }
  }

  // Get statistics for a user
  static async getUserStats(userId) {
    try {
      const stats = await EventHistory.aggregate([
        { $match: { user: new require("mongoose").Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
            lastActivity: { $max: "$timestamp" },
          },
        },
      ]);

      const result = {
        created: 0,
        registered: 0,
        unregistered: 0,
        lastActivity: null,
      };

      stats.forEach((stat) => {
        result[stat._id] = stat.count;
        if (!result.lastActivity || stat.lastActivity > result.lastActivity) {
          result.lastActivity = stat.lastActivity;
        }
      });

      return result;
    } catch (error) {
      throw new Error("Error fetching user stats: " + error.message);
    }
  }
}

module.exports = EventHistoryService;
