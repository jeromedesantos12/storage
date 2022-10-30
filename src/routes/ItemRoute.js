// import module third party
const router = require("express").Router();

// import module local
const {
  valid,
  validCreate,
  validUpdate,
  validDelete,
} = require("../utils/validasi/ItemValidasi");

const {
  readItems,
  readItemById,
  searchItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/ItemController");

// route item
router.get("/read", readItems);
router.get("/read/:id", readItemById);
router.get("/search", valid, searchItem);
router.post("/create", validCreate, createItem);
router.put("/update/:id", validUpdate, updateItem);
router.delete("/delete/:id", validDelete, deleteItem);

// export route
module.exports = router;
