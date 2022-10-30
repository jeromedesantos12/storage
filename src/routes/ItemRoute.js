// import module npm
const router = require("express").Router();

// import module buatan sendiri
// utk validasi
const {
  validAdd,
  validUpdate,
  validDelete,
} = require("../utils/validasi/ItemValidasi");
// utk controller
const {
  getItems,
  getItemById,
  searchItem,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/ItemController");

// route item
router.get("/get", getItems);
router.get("/get/:id", getItemById);
router.get("/search", searchItem);
router.post("/add", validAdd, addItem);
router.put("/update/:id", validUpdate, updateItem);
router.delete("/delete/:id", validDelete, deleteItem);

// export route
module.exports = router;
