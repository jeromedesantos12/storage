// import module third party
const router = require("express").Router();

// import module local
const { getHome } = require("../controllers/HomeController");

// route beranda
router.get("/", getHome);

// export route
module.exports = router;
