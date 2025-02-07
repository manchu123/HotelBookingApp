const db = require("../config/db");

// Get all bookings
const getAllBookings = (callback) => {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
    });
};

// Create a new booking
const addBooking = (hotelId, checkIn, checkOut, numRooms, hotelName, callback) => {
    db.get("SELECT location FROM hotels WHERE id = ?", [hotelId], (err, row) => {
        if (err || !row) {
            return callback(err || new Error("Hotel not found"));
        }

        db.run(`
                    INSERT INTO bookings (hotelId, checkIn, checkOut, numRooms, hotelName, location, status)
                    VALUES (?, ?, ?, ?, ?, ?, 'booked')`,
            [hotelId, checkIn, checkOut, numRooms, hotelName, row.location],
            function (err) {
                if (err) return callback(err, null);
                callback(null, { id: this.lastID, hotelId, checkIn, checkOut, numRooms, hotelName, location: row.location, status: "booked" });
            }
        );
    });
};

// Update booking details (check-in, check-out, numRooms)
const updateBooking = (id, checkIn, checkOut, numRooms, callback) => {
    db.run(
        "UPDATE bookings SET checkIn = ?, checkOut = ?, numRooms = ? WHERE id = ?",
        [checkIn, checkOut, numRooms, id],
        function (err) {
            if (err) return callback(err, null);
            if (this.changes === 0) return callback(new Error("Booking not found"), null);
            callback(null, { id, checkIn, checkOut, numRooms });
        }
    );
};

// Update booking status (booked or cancelled)
const updateBookingStatus = (id, status, callback) => {
    if (!["booked", "cancelled"].includes(status)) {
        return callback(new Error("Invalid status value"), null);
    }

    db.run(
        "UPDATE bookings SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
            if (err) return callback(err, null);
            if (this.changes === 0) return callback(new Error("Booking not found"), null);
            callback(null, { id, status });
        }
    );
};

module.exports = { getAllBookings, addBooking, updateBooking, updateBookingStatus };