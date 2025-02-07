const request = require("supertest");
const app = require("../app"); // Adjust the path if needed
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("database.db");

let hotelId = null;

beforeAll(async () => {
    await new Promise((resolve) =>
        db.run("DELETE FROM hotels", () => resolve())
    );

});

describe("Hotel API Tests", () => {


    test("Should add a new hotel", async () => {
        const response = await request(app).post("/hotels").send({
            name: "Test Hotel",
            location: "Test City"
        });
        hotelId = response.body.id;
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Test Hotel");
        expect(response.body.location).toBe("Test City");
    });

    test("Should retrieve all hotels", async () => {
        const response = await request(app).get("/hotels");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("Should retrieve hotels by location", async () => {
        const response = await request(app).get("/hotels?location=Test City");
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should retrieve unique hotel locations", async () => {
        const response = await request(app).get("/hotels/locations");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
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