// import module npm
const router = require("express").Router();

// import module buatan sendiri
const { useError } = require("../controllers/ErrorController");

// route 404
// "*" artinya semua, setelah route di atasnya
router.use("*", useError);

// export route
module.exports = router;
