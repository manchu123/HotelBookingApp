const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const hotelRoutes = require("./routes/hotels");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/hotels", hotelRoutes);
app.use("/bookings", bookingRoutes);

module.exports = app;
