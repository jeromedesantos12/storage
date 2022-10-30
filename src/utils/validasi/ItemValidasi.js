// import module npm
const validator = require("validator");

// import module buatan sendiri
const { load } = require("../../config/modify");

/* contoh input!
  {
      "nama": "Penghapus"
  }
*/

// validasi salah tulis
const body = (value, nama) => {
  if (!nama) value.nama = "Nama tidak boleh kosong!";
  else if (!validator.isAlpha(nama, "en-US", { ignore: " " }))
    value.nama = "Nama harus huruf!";
  return value;
};

// cari data dalam file json
const find = (nama) => {
  const items = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array
  /* items =
  [
    { id: 1, nama: 'Pensil' },
    { id: 2, nama: 'Pulpen' },
    { id: 3, nama: 'Penghapus' },
    { id: 4, nama: 'Kamus' },
    { id: 5, nama: 'Peta' }
  ]
  */
  return items.find((item) => item.nama === nama);
  // return berisi salah satu object dari items.json
  // berdasarkan nama yang sama dengan req.body.nama
  // { id: 3, nama: 'Penghapus' }
};

// middleware validasi tambah
exports.validAdd = (req, res, next) => {
  const value = {};
  const { nama } = req.body;
  const findNama = find(nama);
  // findNama = { id: 3, nama: 'Penghapus' }

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
  const { id } = req.params; // misal "../update/3"
  const { nama } = req.body;
  const findNama = find(nama);
  // findNama = { id: 3, nama: 'Penghapus' }

  body(value, nama);
  if (findNama && findNama.id !== parseInt(id))
    // findNama ada && findNama.id (3) !== req.params.id (2)
    // isi boleh kembar, asal di data punya sendiri (id sama)
    value.namaDuplikat = "Nama sudah digunakan oleh data lain!";
  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  // kenapa harus findNama &&
  // misal findNama?.id
  // jadi mau findNama gak ada (undifined) asal idnya gak sama ya masuk kondisi
  // masalahnya! kalo data aja udh gak ada, udh pasti idnya gak sama

  // jadi data kembarnya (findNama) harus di tangkep dulu biar
  // (findNama !== parseInt(id)) nggak dijalanin pas datanya nggak ada (findNama)

  // (findNama && findNama.id !== parseInt(id))
  // (jika data kembar ada "dan" id dari data kembar tidak sama dengan req.param id)

  // ketika pakai .. && .., 2 kondisi itu harus ada, baru jalan (ngembaliin true)
  // kalo cuma ada salah satu kondisi aja, nggak jalan!

  // misal tadi (!findNama && findNama.id !== parseInt(id))
  // nggak jalan!

  // kalo findItemsUpdateIsi di JoinValidasi:
  // beda karena dia udh di tulis dulu di atas pas di fungsinya, !== parseInt(id)
  // jadi pas dia di deklarasiin di validUpdate dia udh masuk kondisi
  // jika datanya ada / fungsi find(storages,items,id)() ada
  // kalo nggak ada ya otomatis kondisi !== parseInt(id) di dalam fungsi itu
  // juga nggak jalan

  next();
};

// middleware validasi hapus
exports.validDelete = (req, res, next) => {
  const { id } = req.params; // misal "../delete/3"
  const joins = load("joins");
  // variabel joins berisi semua object dari joins.json yang dibungkus array
  /* joins =
  [
    { id: 1, storages: 1, items: [ 1, 2 ] },
    { id: 2, storages: 2, items: [ 3 ] },
    { id: 3, storages: 3, items: [ 4, 5 ] }
  ]
  */

  // children manggil isi array di parent lalu samain dengan id children
  // ref: findItems.JoinValidasi.js

  // cari data dalam array items joins yang isinya, "sama dengan id params items"
  // data yg dibutuhkan "cuma" satu! (jadi gak perlu filter)
  // ref: validUpdate.JoinValidasi.js

  const restrict = joins.find((join) =>
    join.items.some((item) => item === parseInt(id))
  );
  /* restrict
      penerapan on delete restrict: 
      jika data masih ada dalam parent, data di children nggak boleh hapus
      kalo nggak jadi null isi data parentnya

      kenapa pakai find? 
      karena di validasi sebelumnya (dalam file JoinValidasi)
      data dalam array tidak boleh kembar
        - "items sudah ada!"

      jadi cukup ambil 1 data aja, tanpa harus filter
      { id: 2, storages: 2, items: [ 3 ] } 
  */
  if (restrict) {
    return res.status(400).json({
      message: "Hapus terlebih dahulu data pada join!",
    });
  }
  next();
};
