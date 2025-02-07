const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS hotels (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              name TEXT NOT NULL,
                                              location TEXT NOT NULL
        )`
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                hotelId INTEGER NOT NULL,
                                                checkIn TEXT NOT NULL,
                                                checkOut TEXT NOT NULL,
                                                numRooms INTEGER NOT NULL,
                                                hotelName TEXT NOT NULL,
                                                location TEXT NOT NULL,
                                                status TEXT NOT NULL,
                                                FOREIGN KEY (hotelId) REFERENCES hotels(id)
            )`
    );

    // Check if hotels table is empty and add 15 hotels if so
    db.get("SELECT COUNT(*) AS count FROM hotels", (err, row) => {
        if (err) {
            console.error("Error checking hotels table:", err.message);
        } else {
            if (row.count === 0) {
                const hotels = [
                    { name: "Grand Plaza", location: "New York" },
                    { name: "Riverside Inn", location: "New York" },
                    { name: "Skyline Suites", location: "New York" },
                    { name: "Harborview Hotel", location: "New York" },
                    { name: "Ocean Breeze", location: "Los Angeles" },
                    { name: "Pacific Heights", location: "Los Angeles" },
                    { name: "Sunny Beach Resort", location: "Los Angeles" },
                    { name: "Canyon View Lodge", location: "Los Angeles" },
                    { name: "Windy City Hotel", location: "Chicago" },
                    { name: "Lakefront Inn", location: "Chicago" },
                    { name: "The Oakwood", location: "Chicago" },
                    { name: "Cityscape Hotel", location: "Chicago" },
                    { name: "Sunset Paradise", location: "Miami" },
                    { name: "Tropical Breeze Resort", location: "Miami" },
                    { name: "Beachfront Villas", location: "Miami" }
                ];

                const stmt = db.prepare("INSERT INTO hotels (name, location) VALUES (?, ?)");

                hotels.forEach(hotel => {
                    stmt.run(hotel.name, hotel.location, (err) => {
                        if (err) {
                            console.error("Error inserting hotel:", err.message);
                        }
                    });
                });

                stmt.finalize(() => {
                   // console.log("15 hotels added.");
                });
            } else {
               // console.log("Hotels table already contains records.");
            }
        }
    });
});

module.exports = db;
