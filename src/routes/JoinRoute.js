// import module npm
const router = require("express").Router();

// import module buatan sendiri
// utk validasi
const { validAdd, validUpdate } = require("../utils/validasi/JoinValidasi");
// utk controller
const {
  getJoins,
  getJoinById,
  addJoin,
  updateJoin,
  deleteJoin,
} = require("../controllers/JoinController");

// route join
router.get("/get", getJoins);
router.get("/get/:id", getJoinById);
router.post("/add", validAdd, addJoin);
router.put("/update/:id", validUpdate, updateJoin);
router.delete("/delete/:id", deleteJoin);

// export route
module.exports = router;
