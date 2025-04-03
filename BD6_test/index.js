let cors = require("cors");
let express = require("express");
const {
  getAllTravelPackages,
  getPackageByDestination,
  getPackageById,
  getBookingByPackageId,
  addBooking,
  updateAvailableSlot,
} = require("./controllers");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/packages", async (req, res) => {
  const packages = await getAllTravelPackages();
  res.json({ packages });
});

app.get("/packages/:destination", async (req, res) => {
  const travelPackage = await getPackageByDestination(req.params.destination);
  res.json({ package: travelPackage });
});

app.get("/bookings/:packageId", async (req, res) => {
  const bookings = await getBookingByPackageId(parseInt(req.params.packageId));
  res.json({ bookings: bookings });
});

app.post("/bookings", async (req, res) => {
  const { packageId, customerName, bookingDate, seats } = req.body;
  const newBooking = await addBooking(
    packageId,
    customerName,
    bookingDate,
    seats,
  );
  res.status(201).json({ booking: newBooking });
});

app.post("/packages/update-seats", async (req, res) => {
  const { packageId, seatsBooked } = req.body;
  const updatePackage = await updateAvailableSlot(packageId, seatsBooked);
  res.status(200).json({ package: updatePackage });
});

module.exports = { app };
