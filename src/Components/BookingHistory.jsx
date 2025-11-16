import React from "react";
import "../styles/BookingHistory.css";

export default function BookingHistory({ bookings }) {
  const list = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="history-card">
      <h3 className="history-title">Booking History</h3>

      {list.length === 0 ? (
        <div className="empty-history">No bookings yet.</div>
      ) : (
        <div className="history-list">
          {list.map((b, i) => (
            <div className="history-item" key={b.id || i}>
              <img src={b.image || "/images/Dining-room.jpg"} alt="venue" className="history-thumb" />
              <div className="history-info">
                <div className="history-venue">{b.venue || b.title || "Venue"}</div>
                <div className="history-date">{b.date || b.time || ""}</div>
              </div>
              <button className="view-btn">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
