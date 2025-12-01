import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingAPI } from "../api.js";
import CustomModal from "./CustomModal.jsx";
import "../styles/BookingForm.css";
import { useUser } from "./UserContext";


export default function BookingForm({ venueId, venueData, onClose }) {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const currentUser = user;

  const venueName = venueData?.venueName || "Unknown Venue";
  const venueImage = venueData?.image || "/images/Dining-room.jpg";
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    console.log('🔵 BookingForm - Context user:', user);
    console.log('🔵 BookingForm - User ID:', user?.userId);
    console.log('🔵 BookingForm - Venue ID:', venueId);
    console.log('🔵 Extracted venueName:', venueName);
    console.log('🔵 Extracted venueImage:', venueImage);
  }, [user, venueId, venueName, venueImage]);

  const saveBookingToBackend = async (payload) => {
  console.log('🔵 saveBookingToBackend - currentUser:', currentUser);
  
  if (!currentUser || !currentUser.userId) {
    const errorMsg = "You must be logged in to book a venue.";
    setModalMessage(errorMsg);
    setModalOpen(true);
    throw new Error(errorMsg);
  }

  try {
    const bookingDate = payload.date; 
    
    // "HH:mm:ss" format for java.sql.Time
    const formattedTimeSlot = `${payload.startTime}:00`;
    
    const bookingData = {
      eventName: payload.eventName,
      date: bookingDate, 
      timeSlot: formattedTimeSlot,
      capacity: parseInt(payload.attendees),
      description: payload.description,
      eventType: payload.eventType,
      status: false,
      venue: payload.venue, 
      user: { 
        userId: parseInt(currentUser.userId) 
      }
    };

    console.log('🔵 Sending booking data:', JSON.stringify(bookingData, null, 2));

    const response = await fetch(`http://localhost:8080/api/bookings/user/${currentUser.userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Backend error response:', errorText);
      throw new Error(`Failed to create booking: ${errorText}`);
    }

    const savedBooking = await response.json();
    console.log('🟢 Booking saved successfully:', savedBooking);
    
    // Update local storage for immediate UI update
    updateLocalBookings(savedBooking, payload);
    
    return savedBooking;
  } catch (error) {
    console.error("Failed to save booking:", error);
    throw error;
  }
};


  const updateLocalBookings = (savedBooking, payload) => {
    try {
      const existing = JSON.parse(localStorage.getItem("userBookings") || "[]");
      const newBooking = {
        id: savedBooking.bookingId,
        venueName: venueName,
        eventDate: formatEventDate(payload.date),
        endTime: toLocaleTime(payload.endTime),
        duration: `${toLocaleTime(payload.startTime)} - ${toLocaleTime(payload.endTime)}`,
        guests: `${payload.attendees} pax`,
        bookedBy: currentUser?.firstName || "You", // Use currentUser here
        status: savedBooking.status ? "confirmed" : "pending",
        image: venueImage,
      };

      const updated = [newBooking, ...existing];
      localStorage.setItem("userBookings", JSON.stringify(updated));
      
      // Trigger event for other components
      window.dispatchEvent(new Event('bookingUpdated'));
    } catch (error) {
      console.error("Error updating local bookings:", error);
    }
  };

  // Minimum selectable date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const toISODate = (d) => d.toISOString().slice(0, 10);
  const minDate = toISODate(tomorrow);

  const generateHourlyOptions = () => {
    const opts = [];
    for (let h = 7; h <= 22; h++) {
      const hour12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? "AM" : "PM";
      opts.push({ 
        value: `${String(h).padStart(2, "0")}:00`, 
        label: `${hour12}:00 ${ampm}`, 
        hour24: h 
      });
    }
    return opts;
  };

  const timeOptions = useMemo(generateHourlyOptions, []);

  // Form state
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState(minDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [attendees, setAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Modal & countdown state
  const [showConfirm, setShowConfirm] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef(null);

  const allowedEndOptions = useMemo(() => {
    if (!startTime) return timeOptions;
    const startHour = Number(startTime.split(":")[0]);
    const endHours = [];
    for (let delta = 1; delta <= 6; delta++) {
      const h = startHour + delta;
      if (h <= 22) endHours.push(h);
    }
    return timeOptions.filter((opt) => endHours.includes(opt.hour24));
  }, [startTime, timeOptions]);

  const allowedStartOptions = useMemo(() => {
    return timeOptions.filter((opt) => {
      const s = opt.hour24;
      const latestEnd = Math.min(s + 6, 22);
      return s + 1 <= latestEnd;
    });
  }, [timeOptions]);

  // Ensure endTime is valid when startTime changes
  useEffect(() => {
    const allowedValues = allowedEndOptions.map((o) => o.value);
    if (allowedValues.length === 0) {
      setEndTime("");
    } else if (!allowedValues.includes(endTime)) {
      setEndTime(allowedValues[0]);
    }
  }, [startTime, allowedEndOptions]);

  // Defaults
  useEffect(() => {
    if (!startTime) setStartTime("09:00");
    if (!endTime) setEndTime("10:00");
  }, []);

  const validate = () => {
    const e = {};

    if (!date) e.date = "Please select a date.";
    else if (date < minDate) e.date = "Please select a future date.";

    if (!eventName.trim()) e.eventName = "Please enter an event name.";
    if (!eventType) e.eventType = "Please choose an event type.";
    if (!startTime) e.startTime = "Please select a start time.";
    if (!endTime) e.endTime = "Please select an end time.";

    if (startTime && endTime) {
      const startH = Number(startTime.split(":")[0]);
      const endH = Number(endTime.split(":")[0]);
      const diff = endH - startH;
      if (diff <= 0) e.time = "End time must be later than start time.";
      else if (diff > 6) e.time = "Duration cannot exceed 6 hours.";
    }

    // 24 hour advance warning
    try {
      if (date && startTime) {
        const [year, month, day] = date.split("-").map(Number);
        const [hour, minute] = startTime.split(":").map(Number);
        const eventStart = new Date(year, month - 1, day, hour, minute || 0, 0);
        const now = new Date();
        const diffMs = eventStart.getTime() - now.getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;
        if (diffMs < oneDayMs) {
          e.startTimeAdvance = "Bookings must be made at least 24 hours before the event start.";
        }
      }
    } catch {
      e.startTimeAdvance = "Invalid date/time selection.";
    }

    if (attendees === "" || attendees === null) e.attendees = "Please enter expected attendees.";
    else if (Number.isNaN(Number(attendees)) || Number(attendees) <= 0) e.attendees = "Attendees must be a positive number.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatEventDate = (isoDate) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return isoDate;
    }
  };

  const toLocaleTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m || 0, 0, 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };


const updateUserBookings = (bookings) => {
  try {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      const updatedUser = {
        ...user,
        bookings: bookings.map((booking, index) => ({ 
          id: booking.id || index 
        }))
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error("Error updating user bookings:", error);
  }
};

const handleSubmit = async (ev) => {
  ev.preventDefault();
  console.log('🔵 Form submitted');
  
  const isValid = validate();
  console.log('🔵 Form validation result:', isValid);
  console.log('🔵 Current errors:', errors);
  
  if (!isValid) {
    console.log('🔴 Form validation failed');
    return;
  }

  // Debug the date before creating payload
  console.log('🔵 Raw date from form:', date);
  console.log('🔵 Date type:', typeof date);
  
  const payload = {
    venueName, 
    eventName: eventName.trim(),
    eventType,
    date: date, // Use the date directly as it's already in YYYY-MM-DD
    startTime,
    endTime,
    attendees: Number(attendees),
    description: description.trim(),
    image: venueImage,
    venue: { venueId: parseInt(venueId) }
  };

  console.log('🔵 Payload to submit:', payload);
  console.log('🔵 Venue ID being sent:', venueId);

  try {
    console.log('🟡 Starting saveBookingToBackend...');
    const savedBooking = await saveBookingToBackend(payload);
    console.log('🟢 Booking saved successfully:', savedBooking);
    
    setSubmittedData({ ...payload, bookingId: savedBooking.bookingId });
    setShowConfirm(true);
    setCountdown(5);

    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current);
          setShowConfirm(false);
          onClose();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  } catch (error) {
    console.error('🔴 Error submitting form:', error);
    setErrors({ submit: error.message });
  }
};
  const handleCancel = (ev) => {
    ev.preventDefault();
    onClose();
  };

  // Cleanup countdown
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div className="booking-form-modal">
      <div className="modal-header">
        <h2 id="bookingTitle">Booking Form - {venueName}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        {/* Form fields remain the same as your original */}
        <div className="row">
          <label className="field-label">Date</label>
          <input
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
            className={errors.date ? "invalid" : ""}
            required
          />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>

        <div className="row">
          <label className="field-label">Event Name</label>
          <input
            type="text"
            placeholder="e.g. CodeChum Certification"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            aria-invalid={!!errors.eventName}
            className={errors.eventName ? "invalid" : ""}
            required
          />
          {errors.eventName && <div className="form-error">{errors.eventName}</div>}
        </div>

        <div className="row">
          <label className="field-label">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            aria-invalid={!!errors.eventType}
            className={errors.eventType ? "invalid" : ""}
            required
          >
            <option value="">Select Type</option>
            <option value="Meeting">Meeting</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Academic">Academic</option>
          </select>
          {errors.eventType && <div className="form-error">{errors.eventType}</div>}
        </div>

        <div className="row time-row">
          <div className="time-col">
            <label className="field-label">Start Time</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              aria-invalid={!!(errors.startTime || errors.time || errors.startTimeAdvance)}
              className={errors.startTime || errors.time || errors.startTimeAdvance ? "invalid" : ""}
              required
            >
              <option value="">-- Start --</option>
              {timeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.startTime && <div className="form-error">{errors.startTime}</div>}
          </div>

          <div className="time-col">
            <label className="field-label">End Time</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              aria-invalid={!!(errors.endTime || errors.time)}
              className={errors.endTime || errors.time ? "invalid" : ""}
              required
            >
              <option value="">-- End --</option>
              {allowedEndOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.endTime && <div className="form-error">{errors.endTime}</div>}
          </div>
        </div>

        {(errors.time || errors.startTimeAdvance) && (
          <div className="form-error">{errors.time || errors.startTimeAdvance}</div>
        )}

        <div className="row">
          <label className="field-label">Expected Attendees</label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 45"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            aria-invalid={!!errors.attendees}
            className={errors.attendees ? "invalid" : ""}
            required
          />
          {errors.attendees && <div className="form-error">{errors.attendees}</div>}
        </div>

        <div className="row">
          <label className="field-label">Purpose / Description</label>
          <textarea
            placeholder="Describe your event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>

        <div className="actions">
          <button type="button" className="btn cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn submit">
            Submit
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && submittedData && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Booking confirmation">
          <div className="confirm-modal">
            <div className="confirm-top">
              <div className="celebrate">🎉</div>
              <h2>Booking submitted</h2>
              <p className="confirm-venue">{submittedData.venueName}</p>
            </div>

            <div className="confirm-body">
              <div className="confirm-row">
                <strong>Date:</strong>
                <span>{new Date(submittedData.date).toLocaleDateString()}</span>
              </div>
              <div className="confirm-row">
                <strong>Time:</strong>
                <span>{`${toLocaleTime(submittedData.startTime)} - ${toLocaleTime(submittedData.endTime)}`}</span>
              </div>
              <div className="confirm-row">
                <strong>Status:</strong>
                <span>Pending</span>
              </div>
            </div>

            <div className="confirm-actions">
              <button
                className="btn confirm-primary"
                onClick={() => {
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setShowConfirm(false);
                  onClose();
                  navigate("/bookings");
                }}
              >
                View My Bookings
              </button>

              <button
                className="btn confirm-ghost"
                onClick={() => {
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setShowConfirm(false);
                  onClose();
                }}
              >
                Close ({countdown})
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Custom modal for errors */}
      <CustomModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}