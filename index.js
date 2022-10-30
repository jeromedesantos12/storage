// import module third party
require("dotenv").config();
const express = require("express");

// import module local
require("./src/config/Run");
const StorageRoute = require("./src/routes/StorageRoute");
const ItemRoute = require("./src/routes/ItemRoute");
const JoinRoute = require("./src/routes/JoinRoute");
const HomeRoute = require("./src/routes/HomeRoute");
const ErrorRoute = require("./src/routes/ErrorRoute");

// setup module
const app = express();
const { PORT } = process.env;

// parsing data dari input body ke json
app.use(express.json());

// daftar route
app.use("/storage", StorageRoute);
app.use("/item", ItemRoute);
app.use("/join", JoinRoute);
app.use("/", HomeRoute);
app.use("*", ErrorRoute);

// bersihkan console
console.clear();

// jalankan & tes koneksi server
app.listen(PORT, () => console.log(`Server up and running on :${PORT}...`));
