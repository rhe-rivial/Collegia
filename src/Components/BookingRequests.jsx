import React, { useEffect, useState } from "react";
import "../styles/BookingRequests.css";
import CustomModal from "./CustomModal";
import { useUser } from "./UserContext";

export default function BookingRequests() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Modal (info + confirm)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmCallback, setModalConfirmCallback] = useState(null);

  const showInfoModal = (message) => {
    setModalMessage(message);
    setModalConfirmCallback(null);
    setModalOpen(true);
  };

  const showConfirmModal = (message, onConfirm) => {
    setModalMessage(message);
    setModalConfirmCallback(() => () => {
      onConfirm();
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "canceled", label: "Canceled" },
  ];

  // Fetch ALL bookings for admin
  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:8080/api/bookings");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch bookings");
        }

        const data = await res.json();

        const transformed = data.map((b) => ({
          id: b.bookingId,
          venueName: b.venue?.venueName || "Unknown Venue",
          eventName: b.eventName,
          eventType: b.eventType,
          date: b.date,
          eventDate: formatEventDate(b.date),
          timeSlot: b.timeSlot,
          timeDisplay: formatTimeSlot(b.timeSlot),
          capacity: b.capacity,
          description: b.description,
          status: b.status || "pending",
          requesterName: b.user
            ? `${b.user.firstName || ""} ${b.user.lastName || ""}`.trim()
            : "Unknown User",
          requesterType: b.user?.userType || "Unknown",
          cancelledBy: b.cancelledBy,
          cancelledAt: b.cancelledAt,
          raw: b,
        }));

        setBookings(transformed);
      } catch (err) {
        console.error("Admin bookings fetch error:", err);
        setError(err.message || "Failed to load bookings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const formatEventDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      const d = new Date(dateValue);
      if (Number.isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return "N/A";
    try {
      const timeStr = typeof timeSlot === "string" ? timeSlot : timeSlot.toString();
      const [hours, minutes] = timeStr.split(":");
      const h = parseInt(hours, 10);
      if (Number.isNaN(h)) return timeStr;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeSlot;
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "#28A745";
      case "pending":
        return "#FFC107";
      case "rejected":
        return "#DC3545";
      case "canceled":
        return "#6C757D";
      default:
        return "#6C757D";
    }
  };

  const getStatusText = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";

  const filteredBookings = bookings.filter((b) =>
    activeTab ? (b.status || "pending").toLowerCase() === activeTab : true
  );

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
    setShowDetailsModal(false);
  };

  // Option C: only send cancelledBy when status = "canceled"
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const body = { status: newStatus };
      if (newStatus === "canceled") {
        body.cancelledBy = "admin";
      }

      const res = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }

      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: updated.status || newStatus,
                cancelledBy: updated.cancelledBy,
                cancelledAt: updated.cancelledAt,
              }
            : b
        )
      );

      showInfoModal(`Booking ${newStatus} successfully.`);
    } catch (err) {
      console.error("Update status error:", err);
      showInfoModal("Failed to update booking status. Please try again.");
    }
  };

  const handleApprove = (bookingId) => {
    showConfirmModal("Approve this booking?", () =>
      updateBookingStatus(bookingId, "approved")
    );
  };

  const handleReject = (bookingId) => {
    showConfirmModal("Reject this booking?", () =>
      updateBookingStatus(bookingId, "rejected")
    );
  };

  const handleCancel = (bookingId) => {
    showConfirmModal("Cancel this booking?", () =>
      updateBookingStatus(bookingId, "canceled")
    );
  };

  const renderActions = (booking) => {
    const status = (booking.status || "pending").toLowerCase();

    if (status === "pending") {
      return (
        <div className="abr-actions">
          <button
            className="abr-btn abr-approve"
            onClick={() => handleApprove(booking.id)}
          >
            Approve
          </button>
          <button
            className="abr-btn abr-reject"
            onClick={() => handleReject(booking.id)}
          >
            Reject
          </button>
          <button
            className="abr-btn abr-cancel"
            onClick={() => handleCancel(booking.id)}
          >
            Cancel
          </button>
        </div>
      );
    }

    if (status === "approved") {
      return (
        <div className="abr-actions">
          <button
            className="abr-btn abr-cancel"
            onClick={() => handleCancel(booking.id)}
          >
            Cancel
          </button>
        </div>
      );
    }

    // Rejected / Canceled → no actions
    return <span className="abr-no-actions">No actions</span>;
  };

  if (!user || user.userType?.toLowerCase() !== "admin") {
    return (
      <div className="abr-container">
        <div className="abr-card">
          <h2 className="abr-title">Booking Requests</h2>
          <p>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="abr-container">
        <div className="abr-card">
          <div className="abr-loading">Loading booking requests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="abr-container">
        <div className="abr-card">
          <h2 className="abr-title">Booking Requests</h2>
          <p className="abr-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="abr-container">
        <div className="abr-card">
          <div className="abr-header">
            <h1 className="abr-title">Booking Requests</h1>
          </div>

          {/* Tabs */}
          <div className="abr-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`abr-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="abr-divider" />

          {/* Table */}
          <div className="abr-table-wrapper">
            {filteredBookings.length === 0 ? (
              <div className="abr-empty">
                <h3>No {activeTab} bookings</h3>
                <p>There are no bookings with this status right now.</p>
              </div>
            ) : (
              <table className="abr-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Venue</th>
                    <th>Event</th>
                    <th>Requester</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.venueName}</td>
                      <td>
                        <div className="abr-event-cell">
                          <div className="abr-event-name">{b.eventName}</div>
                          <div className="abr-event-type">{b.eventType}</div>
                        </div>
                      </td>
                      <td>
                        <div className="abr-requester-cell">
                          <div className="abr-requester-name">
                            {b.requesterName}
                          </div>
                          <div className="abr-requester-type">
                            {b.requesterType}
                          </div>
                        </div>
                      </td>
                      <td>{b.eventDate}</td>
                      <td>{b.timeDisplay}</td>
                      <td>{b.capacity}</td>
                      <td>
                        <span
                          className="abr-status-pill"
                          style={{ borderColor: getStatusColor(b.status) }}
                        >
                          <span
                            className="abr-status-dot"
                            style={{ backgroundColor: getStatusColor(b.status) }}
                          />
                          <span
                            className="abr-status-text"
                            style={{ color: getStatusColor(b.status) }}
                          >
                            {getStatusText(b.status)}
                          </span>
                        </span>
                      </td>
                      <td>{renderActions(b)}</td>
                      <td>
                        <button
                          className="abr-btn abr-details"
                          onClick={() => handleOpenDetails(b)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="abr-details-overlay">
            <div className="abr-details-card">
              <div className="abr-details-header">
                <h2>Booking Details</h2>
                <button
                  className="abr-close-btn"
                  onClick={handleCloseDetails}
                >
                  ×
                </button>
              </div>

              <div className="abr-details-body">
                <div className="abr-details-section">
                  <h3>{selectedBooking.venueName}</h3>

                  <div className="abr-details-grid">
                    <div className="abr-details-item">
                      <strong>Event Name:</strong>
                      <span>{selectedBooking.eventName}</span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Event Type:</strong>
                      <span>{selectedBooking.eventType}</span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Date:</strong>
                      <span>{selectedBooking.eventDate}</span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Time:</strong>
                      <span>{selectedBooking.timeDisplay}</span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Guests:</strong>
                      <span>{selectedBooking.capacity}</span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Status:</strong>
                      <span
                        style={{
                          color: getStatusColor(selectedBooking.status),
                          fontWeight: 600,
                        }}
                      >
                        {getStatusText(selectedBooking.status)}
                      </span>
                    </div>
                    <div className="abr-details-item">
                      <strong>Requested By:</strong>
                      <span>
                        {selectedBooking.requesterName} (
                        {selectedBooking.requesterType})
                      </span>
                    </div>
                    {selectedBooking.cancelledBy && (
                      <div className="abr-details-item">
                        <strong>Cancelled By:</strong>
                        <span>{selectedBooking.cancelledBy}</span>
                      </div>
                    )}
                    {selectedBooking.description && (
                      <div className="abr-details-item abr-full-width">
                        <strong>Description:</strong>
                        <p className="abr-description-text">
                          {selectedBooking.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="abr-details-actions">
                  {(selectedBooking.status === "pending" ||
                    selectedBooking.status === "approved") && (
                    <>
                      {selectedBooking.status === "pending" && (
                        <>
                          <button
                            className="abr-btn abr-approve"
                            onClick={() =>
                              handleApprove(selectedBooking.id)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="abr-btn abr-reject"
                            onClick={() =>
                              handleReject(selectedBooking.id)
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        className="abr-btn abr-cancel"
                        onClick={() =>
                          handleCancel(selectedBooking.id)
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfirmCallback}
      />
    </>
  );
}
