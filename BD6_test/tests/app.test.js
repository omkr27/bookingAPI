const request = require("supertest");
const http = require("http");
const { app } = require("../index");

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(() => {
  server.close();
});

describe("Travel booking API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Retrieve All Packages", async () => {
    const response = await request(server).get("/packages");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.packages)).toBe(true);
  });

  test("Retrieve package by destination", async () => {
    const response = await request(server).get("/packages/Paris");
    expect(response.status).toBe(200);
    expect(response.body.package.destination).toBe("Paris");
  });

  test("Add new booking", async () => {
    const newBooking = {
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 12,
    };
    const response = await request(server).post("/bookings").send(newBooking);
    expect(response.status).toBe(201);
    expect(response.body.booking.customerName).toBe("Raj Kulkarni");
  });

  test("Update Available Slots", async () => {
    const updatePackage = {
      packageId: 1,
      seatsBooked: 2,
    };
    const response = await request(server)
      .post("/packages/update-seats")
      .send(updatePackage);
    expect(response.status).toBe(200);
    expect(response.body.package.availableSlots).toBeLessThanOrEqual(10);
  });

  test("Retrieve Bookings for a Package", async () => {
    const response = await request(server).get("/bookings/1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.bookings)).toBe(true);
  });
});
