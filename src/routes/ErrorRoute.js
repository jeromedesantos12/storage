// import module third party
const router = require("express").Router();

// import module local
const { useError } = require("../controllers/ErrorController");

// route 404
// "*" artinya semua, setelah route di atasnya
router.use("*", useError);

// export route
module.exports = router;
