// import module npm
const validator = require("validator");

// import module buatan sendiri
const { load } = require("../../config/modify");

// validasi salah tulis
const body = (value, nama) => {
  if (!nama) value.nama = "Nama tidak boleh kosong!";
  else if (!validator.isAlpha(nama, "en-US", { ignore: " " }))
    value.nama = "Nama harus huruf!";
  return value;
};

// cari data dalam file json
const find = (nama) => {
  const storages = load("storages");
  return storages.find((storage) => storage.nama === nama);
};

// middleware validasi tambah
exports.validAdd = (req, res, next) => {
  const value = {};
  const { nama } = req.body;
  const findNama = find(nama);

  body(value, nama);
  if (findNama) value.namaDuplikat = "Nama sudah digunakan!";
  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

// middleware validasi ubah
exports.validUpdate = (req, res, next) => {
  const value = {};
  const { id } = req.params;
  const { nama } = req.body;
  const findNama = find(nama);

  body(value, nama);
  if (findNama && findNama.id !== parseInt(id))
    value.namaDuplikat = "Nama sudah digunakan oleh data lain!";
  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

// middleware validasi hapus
exports.validDelete = (req, res, next) => {
  const { id } = req.params;
  const joins = load("joins");
  const restrict = joins.find((join) => join.id === parseInt(id));

  if (restrict) {
    return res.status(400).json({
      message: "Hapus terlebih dahulu data pada join!",
    });
  }
  next();
};
