const request = require("supertest");
const app = require("../app");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("database.db");
let hotelId = 1;
let bookingId = null;

beforeAll(async () => {
    await new Promise((resolve) =>
        db.run("DELETE FROM bookings", () => resolve())
    );
    await new Promise((resolve) =>
        db.run("DELETE FROM hotels", () => resolve())
    );

    // Add a test hotel first
    const response = await request(app).post("/hotels").send({
        name: "Booking Test Hotel",
        location: "Booking Test City"
    });

    hotelId = response.body.id;
});

describe("Booking API Tests", () => {
    test("Should create a booking", async () => {
        const response = await request(app).post("/bookings").send({
            hotelId,
            checkIn: "2025-02-10",
            checkOut: "2025-02-15",
            numRooms: 2,
            hotelName: "Booking Test Hotel"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.hotelId).toBe(hotelId);
        expect(response.body.status).toBe("booked");

        bookingId = response.body.id;
    });

    test("Should retrieve all bookings", async () => {
        const response = await request(app).get("/bookings");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should update booking details", async () => {
        const response = await request(app).put(`/bookings/${bookingId}`).send({
            checkIn: "2025-02-12",
            checkOut: "2025-02-18",
            numRooms: 3
        });

        expect(response.status).toBe(200);
        expect(response.body.checkIn).toBe("2025-02-12");
        expect(response.body.numRooms).toBe(3);
    });

    test("Should update booking status", async () => {
        const response = await request(app).put(`/bookings/${bookingId}/status`).send({
            status: "cancelled"
        });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("cancelled");
    });
});

// Cleanup after tests
afterAll(async () => {
    // Delete the test hotel after tests
    await new Promise((resolve) =>
        db.run("DELETE FROM hotels WHERE id = ?", hotelId, () => resolve())
    );

   // console.log("Test hotel deleted.");
    db.close();  // Close the database connection after tests
});