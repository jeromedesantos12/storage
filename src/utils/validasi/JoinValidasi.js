// import module local
const prompt = require("../../config/Query");

// validasi salah tulis
const body = (value, storages, items) => {
  if (!storages) value.storages = "Storages tidak boleh kosong!";
  else if (!Number.isInteger(storages) || storages <= 0)
    value.storages = "Storages harus bilangan bulat positif!";

  if (!items) value.items = "Items tidak boleh kosong!";
  else if (!Array.isArray(items)) value.items = "Items harus array!";
  else if (items.length <= 0) value.items = "Isi items tidak boleh kosong!";
  else if (
    items.filter((item) => item === "").length > 0 ||
    items.find((item) => !Number.isInteger(item)) ||
    items.find((item) => item <= 0)
  )
    value.items = "Isi items harus bilangan bulat positif!";

  return value;
};

// cari data dalam database
// "apakah storages sudah ada dalam tabel joins?"
// "apakah items sudah ada dalam tabel joins_items?"
const find = async (storages, items, id) => {
  const findStorages = await prompt(`CALL read_joinsStoragesID("${storages}")`);

  const findItems = await Promise.all(
    items.map(async (item) => {
      const key = item;
      const isi = await prompt(`CALL read_joins_itemsItemsID("${item}")`);

      return { key, isi: isi[0][0] };
    })
  );

  // console.log("findStorages", findStorages);
  // console.log("findItems", findItems);

  const findStoragesCreate = findStorages[0][0];
  const findItemsCreate = findItems.filter((data) => data.isi !== undefined);

  // console.log("findStoragesCreate", findStoragesCreate);
  // console.log("findItemsCreate", findItemsCreate);

  const findItemsCreateKey = findItemsCreate.map((key) => key.key);
  const findItemsCreateIsi = findItemsCreate.map((isi) => isi.isi);

  // console.log("findItemsCreateKey", findItemsCreateKey);
  // console.log("findItemsCreateIsi", findItemsCreateIsi);

  const findStoragesUpdate = id
    ? findStoragesCreate && findStoragesCreate.id !== parseInt(id)
    : null;
  const findItemsUpdate = id
    ? findItemsCreate.filter((find) => find.isi.joins_id !== parseInt(id))
    : null;

  // console.log("id", id);
  // console.log();
  // console.log("findStoragesUpdate", findStoragesUpdate);
  // console.log("findItemsUpdate", findItemsUpdate);

  const findItemsUpdateKey = id ? findItemsUpdate.map((key) => key.key) : null;
  const findItemsUpdateIsi = id ? findItemsUpdate.map((isi) => isi.isi) : null;

  // console.log("findItemsUpdate", findItemsUpdate);
  // console.log("findItemsUpdateKey", findItemsUpdateKey);
  // console.log("findItemsUpdateIsi", findItemsUpdateIsi);

  return {
    findStoragesCreate,
    findItemsCreateKey,
    findItemsCreateIsi,
    findStoragesUpdate,
    findItemsUpdateKey,
    findItemsUpdateIsi,
  };
};

// cari data dalam database
// "apakah storages belum ada dalam storages?"
// "apakah items belum ada dalam items?"

const data = async (storages, items) => {
  const dataStorage = await prompt(
    `SELECT * FROM storages WHERE id = "${storages}"`
  );

  const dataItem = await Promise.all(
    items.map(async (item) => {
      const key = item;
      const isi = await prompt(`SELECT * FROM items WHERE id = "${item}"`);

      return { key, isi: isi[0] };
    })
  );

  const dataStorages = dataStorage[0] === undefined;
  const dataItems = dataItem.filter((data) => data.isi === undefined);

  // console.log("dataStorages", dataStorages);
  // console.log("dataItems", dataItems);

  const dataItemsKey = dataItems.map((key) => key.key);
  const dataItemsUndefined = dataItems.map((isi) => isi.isi);

  // console.log("dataItemsKey", dataItemsKey);
  // console.log("dataItemsUndefined", dataItemsUndefined);

  return { dataStorages, dataItemsKey, dataItemsUndefined };
};

// middleware validasi tambah
exports.validCreate = async (req, res, next) => {
  const value = {};
  const { storages, items } = req.body;
  body(value, storages, items);

  if (Object.keys(value).length === 0) {
    const { findStoragesCreate, findItemsCreateKey, findItemsCreateIsi } =
      await find(storages, items);
    const { dataStorages, dataItemsKey, dataItemsUndefined } = await data(
      storages,
      items
    );
    if (dataStorages)
      value.storagesDB = "Storages tidak ada dalam tabel storages!";
    if (dataItemsUndefined.length > 0)
      value.itemsDB = `Isi items ${dataItemsKey} tidak ada dalam tabel items!`;
    if (findStoragesCreate)
      value.storagesDuplikat = "Storages sudah digunakan!";
    if (findItemsCreateIsi.length > 0)
      value.itemsDuplikat = `Isi items ${findItemsCreateKey} sudah digunakan!`;
  }

  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

exports.validUpdate = async (req, res, next) => {
  const value = {};
  const { id } = req.params;
  const { storages, items } = req.body;
  body(value, storages, items);

  if (Object.keys(value).length === 0) {
    const { findStoragesUpdate, findItemsUpdateKey, findItemsUpdateIsi } =
      await find(storages, items, id);
    const { dataStorages, dataItemsKey, dataItemsUndefined } = await data(
      storages,
      items
    );
    if (dataStorages)
      value.storagesDB = "Storages tidak ada dalam tabel storages!";
    if (dataItemsUndefined.length > 0)
      value.itemsDB = `Isi items ${dataItemsKey} tidak ada dalam tabel items!`;
    if (findStoragesUpdate)
      value.storagesDuplikat = "Storages sudah digunakan oleh data lain!";
    if (findItemsUpdateIsi.length > 0)
      value.itemsDuplikat = `Isi items ${findItemsUpdateKey} sudah digunakan oleh data lain!`;
  }
  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};
