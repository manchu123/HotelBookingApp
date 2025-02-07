const db = require("../config/db");

// Get all hotels or filter by location
const getHotels = (location, callback) => {
    const query = location
        ? "SELECT * FROM hotels WHERE location = ?"
        : "SELECT * FROM hotels";
    db.all(query, location ? [location] : [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
    });
};

// Get all unique hotel locations
const getHotelLocations = (callback) => {
    db.all("SELECT DISTINCT location FROM hotels", [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
    });
};

// Add a new hotel
const addHotel = (name, location, callback) => {
    db.run("INSERT INTO hotels (name, location) VALUES (?, ?)", [name, location], function (err) {
        if (err) return callback(err, null);
        callback(null, { id: this.lastID, name, location });
    });
};

module.exports = { getHotels, getHotelLocations, addHotel };
