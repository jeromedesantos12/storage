// import module npm
require("dotenv").config();
require("./src/config/fs");
const express = require("express");

// import module buatan sendiri
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

// route kita
app.use("/storage", StorageRoute);
app.use("/item", ItemRoute);
app.use("/join", JoinRoute);
app.use("/", HomeRoute);
app.use("*", ErrorRoute);

// jalankan local server
app.listen(PORT, () => console.log(`Server up and running on :${PORT}...`));
