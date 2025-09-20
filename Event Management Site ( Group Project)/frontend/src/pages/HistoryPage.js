import React, { useState, useEffect } from "react";
import { historyService } from "../services/apiService";
import LoadingSpinner from "../components/LoadingSpinner";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await historyService.getUserHistory({ page, limit });
      setHistory(response.history);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "text-blue-600 bg-blue-100";
      case "registered":
        return "text-green-600 bg-green-100";
      case "unregistered":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "created":
        return "🎯";
      case "registered":
        return "✅";
      case "unregistered":
        return "❌";
      default:
        return "📝";
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && history.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event History</h1>
        <p className="text-gray-600">
          Track all your event activities including creations, registrations,
          and unregistrations
        </p>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Activity Timeline</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner />
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl mb-4 block">📝</span>
            <h3 className="text-lg font-medium mb-2">No Activity Found</h3>
            <p>No event activities match your current filters.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActionColor(
                        item.action
                      )}`}
                    >
                      {getActionIcon(item.action)}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.eventSnapshot?.title || "Unknown Event"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.action === "created" &&
                            "You created this event"}
                          {item.action === "registered" &&
                            "You registered for this event"}
                          {item.action === "unregistered" &&
                            "You unregistered from this event"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(
                          item.action
                        )}`}
                      >
                        {item.action.charAt(0).toUpperCase() +
                          item.action.slice(1)}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        📅{" "}
                        {item.eventSnapshot?.date
                          ? new Date(
                              item.eventSnapshot.date
                            ).toLocaleDateString()
                          : "Date unknown"}
                      </div>
                      <div>
                        📍 {item.eventSnapshot?.location || "Location unknown"}
                      </div>
                      <div>🕒 {formatDate(item.timestamp)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.pages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          page === pagination.page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
