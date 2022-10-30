// import module third party
const router = require("express").Router();

// import module local
const { validCreate, validUpdate } = require("../utils/validasi/JoinValidasi");
const {
  readJoins,
  readJoinById,
  createJoin,
  updateJoin,
  deleteJoin,
} = require("../controllers/JoinController");

// route join
router.get("/read", readJoins);
router.get("/read/:id", readJoinById);
router.post("/create", validCreate, createJoin);
router.put("/update/:id", validUpdate, updateJoin);
router.delete("/delete/:id", deleteJoin);

// export route
module.exports = router;
