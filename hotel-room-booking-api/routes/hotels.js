const express = require("express");
const router = express.Router();
const { getHotels, getHotelLocations, addHotel } = require("../models/hotelModel");

// Get all hotels or filter by location
router.get("/", (req, res) => {
    const { location } = req.query;
    getHotels(location, (err, hotels) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(hotels);
    });
});

// Get all unique hotel locations
router.get("/locations", (req, res) => {
    getHotelLocations((err, locations) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(locations);
    });
});

// Add a new hotel
router.post("/", (req, res) => {
    const { name, location } = req.body;
    if (!name || !location) {
        return res.status(400).json({ error: "Name and location are required" });
    }
    addHotel(name, location, (err, newHotel) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(newHotel);
    });
});

module.exports = router;