import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService, eventService } from "../../services/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";

const AttendeeRegisteredEventsPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmEvent, setConfirmEvent] = useState(null); // event object to confirm unregister
  const [unregisteringId, setUnregisteringId] = useState(null);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const response = await userService.getRegisteredEvents();
      setRegisteredEvents(response.registeredEvents);
    } catch (err) {
      setError("Failed to load your registered events");
      console.error("Error fetching registered events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss success messages
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const openConfirm = (event) => setConfirmEvent(event);
  const closeConfirm = () => setConfirmEvent(null);

  const confirmUnregister = async () => {
    if (!confirmEvent) return;
    const eventId = confirmEvent._id;
    setError("");
    setUnregisteringId(eventId);
    try {
      await eventService.unregisterFromEvent(eventId);
      setRegisteredEvents((prev) => prev.filter((e) => e._id !== eventId));
      setSuccess(`Unregistered from "${confirmEvent.title}"`);
      setConfirmEvent(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to unregister from event"
      );
    } finally {
      setUnregisteringId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);

    if (eventDateTime < now) {
      return { status: "completed", color: "bg-gray-100 text-gray-800" };
    } else if (eventDateTime.toDateString() === now.toDateString()) {
      return { status: "today", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "upcoming", color: "bg-green-100 text-green-800" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Registered Events
          </h1>
          <Link to="/events" className="btn btn-primary">
            Browse More Events
          </Link>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6 flex justify-between items-start">
            <span className="pr-4">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-800 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {registeredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zM8 14v2H6v-2h2zm4 0v2h-2v-2h2z" />
                <path d="M20 6V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No events registered yet
            </h3>
            <p className="text-gray-500 mb-6">
              Discover and register for interesting events!
            </p>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            {/* Events List */}
            <div className="space-y-6">
              {registeredEvents.map((event) => {
                const eventStatus = getEventStatus(event.date);

                return (
                  <div key={event._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 mr-3">
                            {event.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${eventStatus.color}`}
                          >
                            {eventStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-800"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        <div>
                          <div>{formatDate(event.date)}</div>
                          <div className="text-xs">{event.time}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-800"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-800"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7zm15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.59 1.41.59s1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.05-.59-1.42z" />
                        </svg>
                        <span>{event.eventType}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-800"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                        </svg>
                        <span>
                          {event.organizer?.organizationName ||
                            event.organizer?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <Link
                          to={`/events/${event._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details
                        </Link>

                        {event.organizer?.contactInfo?.email && (
                          <a
                            href={`mailto:${event.organizer.contactInfo.email}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Contact Organizer
                          </a>
                        )}
                      </div>

                      {eventStatus.status !== "completed" && (
                        <button
                          onClick={() => openConfirm(event)}
                          disabled={unregisteringId === event._id}
                          className={`btn bg-red-600 text-white hover:bg-red-700 ${
                            unregisteringId === event._id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {unregisteringId === event._id
                            ? "Unregistering..."
                            : "Unregister"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Unregister Modal */}
            {confirmEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={closeConfirm}
                />
                <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Unregister from event
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to unregister from{" "}
                    <span className="font-medium">{confirmEvent.title}</span>?
                    You may lose your spot.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeConfirm}
                      className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmUnregister}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      Yes, Unregister
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendeeRegisteredEventsPage;
