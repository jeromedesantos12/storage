// import module third party
const validator = require("validator");

// import module local
const prompt = require("../../config/Query");

// validasi salah tulis
const body = (value, nama) => {
  if (!nama) value.nama = "Nama tidak boleh kosong!";
  else if (nama.length > 20)
    value.nama = "Nama tidak boleh lebih dari 20 karakter";
  else if (
    typeof nama !== "string" ||
    !validator.isAlpha(nama, "en-US", { ignore: " " })
  )
    value.nama = "Nama harus huruf!";

  return value;
};

// cari data sendiri yang kembar
const find = async (nama) => await prompt(`CALL read_storagesNama("${nama}")`);

// cari "apakah id sudah digunakan sebagai isi storages dalam tabel joins?"
const findRestrict = async (id) =>
  await prompt(`CALL read_joinsStoragesID("${id}")`);

// middleware validasi salah tulis
exports.valid = (req, res, next) => {
  const value = {};
  const { nama } = req.body;

  body(value, nama);
  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

// middleware validasi tambah
exports.validCreate = async (req, res, next) => {
  const value = {};
  const { nama } = req.body;
  body(value, nama);

  if (Object.keys(value).length === 0) {
    const findNama = await find(nama);
    if (findNama[0].length > 0) value.namaDuplikat = "Nama sudah digunakan!";
  }

  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

// middleware validasi ubah
exports.validUpdate = async (req, res, next) => {
  const value = {};
  const { id } = req.params;
  const { nama } = req.body;
  body(value, nama);

  if (Object.keys(value).length === 0) {
    const findNama = await find(nama);
    const notID = findNama[0].filter((find) => find.id !== parseInt(id));
    if (findNama[0].length > 0 && notID.length > 0)
      value.namaDuplikat = "Nama sudah digunakan oleh data lain!";
  }

  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};

// middleware validasi hapus
exports.validDelete = async (req, res, next) => {
  const { id } = req.params;
  const restrict = await findRestrict(id);

  if (restrict[0].length > 0)
    return res.status(400).json({
      message: "Hapus terlebih dahulu data pada joins!",
    });

  next();
};
