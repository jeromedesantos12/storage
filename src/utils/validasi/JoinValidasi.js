// import module buatan sendiri
const { load } = require("../../config/modify");

const body = (value, storages, items) => {
  if (!storages) value.storages = "Storages tidak boleh kosong!";

  if (!items) value.items = "Items tidak boleh kosong!";
  else if (!Array.isArray(items)) value.items = "Items harus array!";
  else if (items.length <= 0) value.items = "Isi items tidak boleh kosong!";
  return value;
};

// cari data dalam file json
// "apakah data sudah ada dalam join.json?"
const find = (storages, items, id) => {
  // ###########
  /* contoh input!
    {
      "storages": 1,
      "items": [9, 1, 2, 100]
    }
  */

  const joins = load("joins");
  // variabel joins berisi semua object dari joins.json yang dibungkus array

  const findStorages = joins.find((join) => join.storages === storages);
  /* findStorages =
      { id: 1, storages: 1, items: [ 1, 2 ] }
  */

  // parent manggil id children lalu samain dengan isi array parent
  // ref: restrict.ItemValidasi.js

  const findItem = items.map((data) => {
    /* data =
      9
      1
      2
      100
    */

    const key = data;
    const isi = joins.find((join) => join.items.some((item) => item === data));
    return { key, isi };
  });
  /* findItem =
    [
      { key: 9, isi: { id: 4, storages: 4, items: [Array] } },
      { key: 1, isi: { id: 1, storages: 1, items: [Array] } },
      { key: 2, isi: { id: 1, storages: 1, items: [Array] } },
      { key: 100, isi: undefined }
    ]
  */

  const findItemsAdd = findItem.filter((data) => data.isi !== undefined);
  /* findItemsAdd = (undefined hilang)
    [
      { key: 9, isi: { id: 4, storages: 4, items: [Array] } },
      { key: 1, isi: { id: 1, storages: 1, items: [Array] } },
      { key: 2, isi: { id: 1, storages: 1, items: [Array] } }
    ]
  */

  const findItemsUpdate = id // => fungsi !== id-nya pindah kemari!
    ? findItemsAdd.filter((find) => find.isi.id !== parseInt(id))
    : null;
  /* findItemsUpdate = misal id 4
    [
      { key: 1, isi: { id: 1, storages: 1, items: [Array] } },
      { key: 2, isi: { id: 1, storages: 1, items: [Array] } }
    ]
  */

  // ADD

  const findItemsAddKey = findItemsAdd.map((key) => key.key);
  // [ 9, 1, 2 ]

  const findItemsAddIsi = findItemsAdd.map((isi) => isi.isi);
  // { { id: 4, storages: 4, items: [ 9, 7, 6 ] } },
  // [ { id: 1, storages: 1, items: [ 1, 2 ] } ]
  // [ { id: 1, storages: 1, items: [ 1, 2 ] } ]

  // UPDATE

  const findItemsUpdateKey = id ? findItemsUpdate.map((key) => key.key) : null;
  // [ 1, 2 ]

  const findItemsUpdateIsi = id ? findItemsUpdate.map((isi) => isi.isi) : null;
  // [ { id: 4, storages: 4, items: [9, 7, 6] } ]
  // [ { id: 1, storages: 1, items: [ 1, 2 ] } ]
  // [ { id: 1, storages: 1, items: [ 1, 2 ] } ]

  return {
    findStorages,
    findItemsAddKey,
    findItemsAddIsi,
    findItemsUpdateKey,
    findItemsUpdateIsi,
  };
};

// cari data dalam file json
// "apakah storages belum ada dalam storages.json?"
// "apakah items belum ada dalam items.json?"
const findByData = (storages, items) => {
  // ###########
  /* contoh input!
    {
      "storages": 3,
      "items": [4, 5]
    }
  */

  const storages_data = load("storages");
  // variabel storages berisi semua object dari storages.json yang dibungkus array

  const items_data = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array

  // 3 => req.body.storages
  const dataStorages = storages_data.find(
    (storageData) => storageData.id === storages
  );
  /* dataStorages =
      { id: 3, nama: 'Kardus C' }
  */

  // [4, 5] => req.body.items
  const dataItem = items.map((data) => {
    /* data =
      4
      5
    */
    const key = data;
    const isi = items_data.find((item) => item.id === data);
    return { key, isi };
  });
  /* dataitem =
    [ 
      { key: 4, isi: { id: 4, nama: 'Kamus' } },
      { key: 5, isi: { id: 5, nama: 'Peta' } }
    ]
  */

  const dataItems = dataItem.filter((data) => data.isi === undefined);
  /* dataitems =
     []  =>  gak ketemu undefined
     [ {key: 101, isi : undefined } ] misal ketemu
  */

  const dataItemsKey = dataItems.map((key) => key.key);
  // [ 101 ] misal ketemu

  const dataItemsUndefined = dataItems.map((isi) => isi.isi);
  // [ undefined ]

  return { dataStorages, dataItemsKey, dataItemsUndefined };
};

// middleware validasi tambah
exports.validAdd = (req, res, next) => {
  const value = {};
  const { storages, items } = req.body;
  const { findStorages, findItemsAddKey, findItemsAddIsi } = find(
    storages,
    items
  );
  const { dataStorages, dataItemsKey, dataItemsUndefined } = findByData(
    storages,
    items
  );

  body(value, storages, items);
  if (!dataStorages) value.storagesJSON = "Storages tidak ada dalam JSON!";
  if (dataItemsUndefined.length > 0)
    value.itemsJSON = `Isi items ${dataItemsKey} tidak ada dalam JSON!`;
  if (findStorages) value.storagesDuplikat = "Storages sudah digunakan!";
  if (findItemsAddIsi.length > 0)
    value.itemsDuplikat = `Isi items ${findItemsAddKey} sudah digunakan!`;
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
  const { storages, items } = req.body;
  const { findStorages, findItemsUpdateKey, findItemsUpdateIsi } = find(
    storages,
    items,
    id
  );
  const { dataStorages, dataItemsKey, dataItemsUndefined } = findByData(
    storages,
    items
  );

  body(value, storages, items);
  if (!dataStorages) value.storagesJSON = "Storages tidak ada dalam JSON!";
  if (dataItemsUndefined.length > 0)
    value.itemsJSON = `Isi items ${dataItemsKey} tidak ada dalam JSON!`;
  if (findStorages && findStorages.id !== parseInt(id))
    value.storagesDuplikat = "Storages sudah digunakan oleh data lain!";
  if (findItemsUpdateIsi.length > 0)
    value.itemsDuplikat = `Isi items ${findItemsUpdateKey} sudah digunakan oleh data lain!`;

  // console.log(findItemsIsi.filter((item) => item.id !== parseInt(id)));

  // cari data di dalam array items yang isinya, "gak sama dengan id params sendiri"
  // data yg dibutuhkan "lebih dari" satu! (perlu di filter karena harus di cek satu-satu)
  // ref: restrict.ItemValidasi.js

  // misal items [4, 5, 1, 3]

  /* findItemsIsi
    [
      { id: 3, storages: 3, items: [ 4, 5 ] } => 4
      { id: 3, storages: 3, items: [ 4, 5 ] } => 5
     
      { id: 1, storages: 1, items: [ 1, 2 ] } => 1      
      { id: 2, storages: 2, items: [ 3 ] } => 3
    ]
  */

  /* findItemsIsi.filter((item) => item.id !== parseInt(id))
      => data yg gak sama dgn id (misal 3)
    [
      { id: 1, storages: 1, items: [ 1, 2 ] } => 1      
      { id: 2, storages: 2, items: [ 3 ] } => 3
    ]
  */

  // length > 0
  // isi data yg gak sama dgn id (id gk kembar)

  // contoh salah!
  /* findItemsIsi.find((item) => item.id !== parseInt(id))
      { id: 1, storages: 1, items: [1, 2] } => 1

      kalo misal ada data lagi yg yg gak sama dgn id (=> 3) nggak bakal muncul
      karena find kalo udh nemu satu data, meskipun data berikutnya masih true
      dia cuma baca data pertamanya (return-nya juga cuma data tunggal, bukan array)

      cara ini pun salah...
      const findId = findItemsIsi.find((item) => item.id === parseInt(id));
      console.log(findId); // tangkep id dulu

      if(!findId) { // jika id gak ada
        console.log("id beda") => tidak lolos
      } else {
        console.log("id kembar") => lolos
      }

     [4, 5, 1, 3]
      misal id : 
          4 ada id => yg dibaca => "id kembar" = lolos
          5 ada id
          1 nggak ada id => harusnya gak lolos
          3 nggak ada id

      tapi pas ada data 1
      jadi malah lolos, padahal 1 nggak ada id, harusnya nggak lolos!
      penyebab karena find udah berhenti di 4 duluan!

      jadi kesalahan juga dari deklarasi si kondisi if(!findId)
      karena meskipun id ada bukan berarti data langsung boleh lolos gitu aja
      masalahnya data yg diterima ada idnya, juga ada yg gak ada idnya
  */

  if (Object.keys(value).length > 0)
    return res.status(400).json({
      message: value,
    });

  next();
};
