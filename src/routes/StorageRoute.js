// import module buatan sendiri
// utk validasi
const router = require("express").Router();
const {
  validAdd,
  validUpdate,
  validDelete,
} = require("../utils/validasi/StorageValidasi");
// utk controller
const {
  getStorages,
  getStorageById,
  searchStorage,
  addStorage,
  updateStorage,
  deleteStorage,
} = require("../controllers/StorageController");

// route storage
router.get("/get", getStorages);
router.get("/get/:id", getStorageById);
router.get("/search", searchStorage);
router.post("/add", validAdd, addStorage);
router.put("/update/:id", validUpdate, updateStorage);
router.delete("/delete/:id", validDelete, deleteStorage);

// export route
module.exports = router;
