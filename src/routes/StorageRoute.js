// import module third party
const router = require("express").Router();

// import module local
const {
  valid,
  validCreate,
  validUpdate,
  validDelete,
} = require("../utils/validasi/StorageValidasi");

const {
  readStorages,
  readStorageById,
  searchStorage,
  createStorage,
  updateStorage,
  deleteStorage,
} = require("../controllers/StorageController");

// route storage
router.get("/read", readStorages);
router.get("/read/:id", readStorageById);
router.get("/search", valid, searchStorage);
router.post("/create", validCreate, createStorage);
router.put("/update/:id", validUpdate, updateStorage);
router.delete("/delete/:id", validDelete, deleteStorage);

// export route
module.exports = router;
