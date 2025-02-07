const express = require("express");
const router = express.Router();
const bookingModel = require("../models/bookingModel"); // Assuming booking model is in models/booking.js

// Get all bookings
router.get("/", (req, res) => {
    bookingModel.getAllBookings((err, bookings) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(bookings);
    });
});

// Create a new booking
router.post("/", (req, res) => {
    const { hotelId, checkIn, checkOut, numRooms, hotelName } = req.body;

    // Validate input
    if (!hotelId || !checkIn || !checkOut || !numRooms || !hotelName) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    bookingModel.addBooking(hotelId, checkIn, checkOut, numRooms, hotelName, (err, booking) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(booking);
    });
});

// Update booking details (check-in, check-out, numRooms)
router.put("/:id", (req, res) => {
    const { checkIn, checkOut, numRooms } = req.body;
    const bookingId = req.params.id;

    if (!checkIn || !checkOut || !numRooms) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    bookingModel.updateBooking(bookingId, checkIn, checkOut, numRooms, (err, updatedBooking) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(updatedBooking);
    });
});

// Update booking status (booked or cancelled)
router.put("/:id/status", (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!status || !["booked", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    bookingModel.updateBookingStatus(bookingId, status, (err, updatedStatus) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(updatedStatus);
    });
});

module.exports = router;
