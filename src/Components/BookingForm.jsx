// src/pages/BookingForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookingForm.css";

/*
  BookingForm.jsx
  - Reads venue id from route param :id
  - Looks up venue title from shared data file (if present) and falls back to defaults
  - Enforces: future date, 24-hour advance booking, start != end, max 6-hour duration
  - Shows confirmation modal on successful submit (with 5s auto-close)
  - "View My Bookings" -> /bookings, "Close" -> /venues/bookings/venue/:id
*/

// Try to import a shared venuesData file. If it's not present, fall back to a minimal list.
let venuesData = [];
try {
  // eslint-disable-next-line import/no-unresolved, global-require
  venuesData = require("../data/venuesData").default || [];
} catch (err) {
  // fallback minimal data if you didn't extract venuesData to a module yet
  venuesData = [
    { id: 1, title: "NGE 101" },
    { id: 2, title: "NGE Hall A" },
    { id: 3, title: "NGE Hall B" },
  ];
}

export default function BookingForm() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const venueIdFromRoute = Number.parseInt(routeId, 10);

  // Lookup venue by id (memoized)
  const venue = useMemo(() => {
    if (Number.isNaN(venueIdFromRoute)) return null;
    return venuesData.find((v) => Number(v.id) === venueIdFromRoute) || null;
  }, [venueIdFromRoute]);

  const venueCode = venue?.title || "NGE 101";

  // Minimum selectable date is tomorrow (UI-level)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const toISODate = (d) => d.toISOString().slice(0, 10);
  const minDate = toISODate(tomorrow);

// --- Replace existing generateHourlyOptions / timeOptions with this ---
const generateHourlyOptions = () => {
  const opts = [];
  // produce times from 07:00 (7 AM) through 22:00 (10 PM)
  for (let h = 7; h <= 22; h++) {
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h < 12 ? "AM" : "PM";
    opts.push({ value: `${String(h).padStart(2, "0")}:00`, label: `${hour12}:00 ${ampm}`, hour24: h });
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

// --- Replace allowedEndOptions useMemo with this ---
const allowedEndOptions = useMemo(() => {
  if (!startTime) return timeOptions;
  const startHour = Number(startTime.split(":")[0]);
  const endHours = [];
  for (let delta = 1; delta <= 6; delta++) {
    const h = startHour + delta;
    // ensure end <= 22 (10 PM)
    if (h <= 22) endHours.push(h);
  }
  return timeOptions.filter((opt) => endHours.includes(opt.hour24));
}, [startTime, timeOptions]);

// --- Insert allowedStartOptions after timeOptions ---
const allowedStartOptions = useMemo(() => {
  // start candidates are times in timeOptions where at least one end option exists
  return timeOptions.filter((opt) => {
    const s = opt.hour24;
    // earliest end is s+1, latest end is min(s+6, 22)
    const latestEnd = Math.min(s + 6, 22);
    return s + 1 <= latestEnd; // ensures at least one possible end hour
  });
}, [timeOptions]);

  // Ensure endTime remains valid when startTime changes
  useEffect(() => {
    const allowedValues = allowedEndOptions.map((o) => o.value);
    if (allowedValues.length === 0) {
      setEndTime("");
    } else if (!allowedValues.includes(endTime)) {
      setEndTime(allowedValues[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, allowedEndOptions]);

  // sensible defaults on mount
  useEffect(() => {
    if (!startTime) setStartTime("09:00");
    if (!endTime) setEndTime("10:00");
  }, []); // run once

  // Validation: future date, start != end, max 6 hours, attendees positive, 24-hour advance
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

    // Enforce bookings must be made at least 24 hours in advance of event start
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

  const handleCancel = (ev) => {
    ev.preventDefault();
    navigate(-1);
  };

  // helper: format "HH:MM" to localized time string like "10:00 AM"
  const toLocaleTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m || 0, 0, 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

// --- Insert inside BookingForm component, above handleSubmit ---
const formatEventDate = (isoDate) => {
  try {
    const d = new Date(isoDate);
    // "12 Mar 2021" style
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return isoDate;
  }
};

const saveBookingToLocal = (payload) => {
  // read existing bookings (or fallback to empty array)
  const existing = (() => {
    try {
      const raw = localStorage.getItem("userBookings");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const newBooking = {
    id: Date.now(), // simple unique id
    venueName: payload.venueCode || "Unknown Venue",
    eventDate: formatEventDate(payload.date),
    duration: `${toLocaleTime(payload.startTime)} - ${toLocaleTime(payload.endTime)}`,
    guests: `${payload.attendees} pax`,
    bookedBy: "You",
    status: "pending",
    image: payload.image || "https://placehold.co/103x94",
  };

  const updated = [newBooking, ...existing];
  try {
    localStorage.setItem("userBookings", JSON.stringify(updated));
  } catch (err) {
    // ignore write errors for now
    console.error("Failed to save booking to localStorage", err);
  }
};

const handleSubmit = (ev) => {
  ev.preventDefault();
  if (!validate()) return;

  const payload = {
    venueCode,
    eventName: eventName.trim(),
    eventType,
    date,
    startTime,
    endTime,
    attendees: Number(attendees),
    description: description.trim(),
    image: venue?.image || "/images/Dining-room.jpg",
  };

  // used in order to save to booking
  saveBookingToLocal(payload);

  // for confirmation modal
  setSubmittedData(payload);
  setShowConfirm(true);
  setCountdown(5);

  // countdown until the thing closes
  if (countdownRef.current) clearInterval(countdownRef.current);
  countdownRef.current = setInterval(() => {
    setCountdown((c) => {
      if (c <= 1) {
        clearInterval(countdownRef.current);
        setShowConfirm(false);
        navigate(`/venues`);
        return 0;
      }
      return c - 1;
    });
  }, 1000);
};


  // cleanup countdown
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <main className="booking-form-page" aria-labelledby="bookingTitle">
      <header className="booking-header">
        <h1 id="bookingTitle">Booking Form - {venueCode}</h1>
      </header>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
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

      {/* This is the Confirmation modal */}
      {showConfirm && submittedData && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label="Booking confirmation">
          <div className="confirm-modal">
            <div className="confirm-top">
              <div className="celebrate">🎉</div>
              <h2>Booking submitted</h2>
              <p className="confirm-venue">{submittedData.venueCode}</p>
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
                  navigate("/venues/bookings");
                }}
              >
                View My Bookings
              </button>

              <button
                className="btn confirm-ghost"
                onClick={() => {
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setShowConfirm(false);
                  navigate(`/venues`);
                }}
              >
                Close ({countdown})
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
