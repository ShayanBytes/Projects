import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EventCard = ({ event, showRegistrationButton = true, onRegister }) => {
  const { isAuthenticated, user } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isRegistered = event.attendees?.some((attendee) => {
    const attendeeUser = attendee.user;
    const attendeeId =
      typeof attendeeUser === "string" ? attendeeUser : attendeeUser?._id;
    const userId = user?.id || user?._id;
    return attendeeId === userId;
  });

  const isOwner = (() => {
    const organizer = event.organizer;
    const organizerId =
      typeof organizer === "string" ? organizer : organizer?._id;
    const userId = user?.id || user?._id;
    return organizerId && userId && organizerId === userId;
  })();

  const isFull = event.currentAttendees >= event.maxAttendees;

  return (
    <div className="card flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-2">{event.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            event.status === "upcoming"
              ? "bg-green-100 text-green-800"
              : event.status === "ongoing"
              ? "bg-yellow-100 text-yellow-800"
              : event.status === "completed"
              ? "bg-gray-100 text-gray-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Date:</span>
          <span className="ml-2">
            {formatDate(event.date)} at {event.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Location:</span>
          <span className="ml-2">{event.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Type:</span>
          <span className="ml-2">{event.eventType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Organizer:</span>
          <span className="ml-2">
            {event.organizer?.organizationName || event.organizer?.name}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Capacity:</span>
          <span className="ml-2">
            {event.currentAttendees} / {event.maxAttendees}
            {isFull && <span className="text-red-600 ml-1">(Full)</span>}
          </span>
        </div>
      </div>

      {/* Actions section - always at bottom */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-auto">
        <Link
          to={`/events/${event._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details
        </Link>

        {isAuthenticated && showRegistrationButton && !isOwner && (
          <div className="flex items-center">
            {isRegistered ? (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Registered</span>
              </div>
            ) : (
              <button
                onClick={() => onRegister && onRegister(event._id)}
                disabled={isFull}
                className={`btn ${
                  isFull
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {isFull ? "Full" : "Register"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
