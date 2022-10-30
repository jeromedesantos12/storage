// import module npm
const router = require("express").Router();

// import module buatan sendiri
const { getHome } = require("../controllers/HomeController");

// route beranda
router.get("/", getHome);

// export route
module.exports = router;
