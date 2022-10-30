// import module third party
require("dotenv").config();
const mysql = require("mysql2");

// setup module
const { HOST, USER, PASSWORD, DATABASE } = process.env;
const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  // database: DATABASE,
  multipleStatements: true,
});

// tes koneksi database
db.connect((error) => {
  if (error) throw error;
  console.log("Database Connected!");
});

// export module
module.exports = db;
