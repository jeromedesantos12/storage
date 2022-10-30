// import module buatan sendiri
const { load, save } = require("../config/modify");

// middleware tampil semua data
exports.getItems = (req, res) => {
  const items = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array

  if (items.length == 0)
    return res.status(404).json({
      message: "Data masih kosong!",
    });

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    items, // tampilin disini
  });
};

// middleware tampil salah satu data
// berdasarkan id dari parameter url
exports.getItemById = (req, res) => {
  const { id } = req.params;

  const items = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array

  const item = items.find((item) => item.id === parseInt(id));
  // variabel item berisi salah satu object dari items.json
  // berdasarkan id yg sama dengan id parameter url

  if (!item)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    item, // tampilin disini
  });
};

// middleware tambah data
exports.addItem = (req, res) => {
  const { nama } = req.body;

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
  const item = items.at(-1);
  // ambil 1 items dari bawah
  // item = { id: 5, nama: 'Peta' }

  const id = item ? item.id + 1 : 1;
  // buat auto increment
  // nambahin 1 dari id file json
  // 5 + 1 = 6

  // kalo data gak ada, input 1 aja

  items.push({ id, nama });
  // req.body di push ke array item
  /* items = (datanya nambah)
  [
    { id: 1, nama: 'Pensil' },
    { id: 2, nama: 'Pulpen' },
    { id: 3, nama: 'Penghapus' },
    { id: 4, nama: 'Kamus' },
    { id: 5, nama: 'Peta' },
    { id: 6, nama: 'Handuk' }
  ]
 */
  save("items", items);
  // file json di tulis ulang dengan isi array items

  res.status(201).json({
    message: "Data ditambahkan!",
  });
};

// middleware ubah data
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

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

  const item = items.find((item) => item.id === parseInt(id));
  // variabel item berisi salah satu object dari items.json
  // berdasarkan id yg sama dengan id parameter url

  const index = items.findIndex((item) => item.id === parseInt(id));
  // variabel item berisi salah satu "index" dari items.json
  // berdasarkan id yg sama dengan id parameter url
  // misal: index ke- 2

  console.log("item", items);
  console.log("index", index);

  if (!item)
    // nggak bisa di kunci pakai const index => if (!index)
    // pesan error TypeError: Cannot set properties of undefined

    // kalo data nggak ada hasil, if (index === -1)
    // jadi tangkep -1 nya
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  items[index].nama = nama;
  // isi array di ubah dengan req.body.nama berdasakan index
  /* items =
  [
    { id: 1, nama: 'Pensil' }, 0
    { id: 2, nama: 'Pulpen' }, 1
    { id: 3, nama: 'Data yang Diubah' }, <== index ke- 2
    { id: 4, nama: 'Kamus' }, 3
    { id: 5, nama: 'Peta' } 4
  ]
  */

  save("items", items);
  // file json di tulis ulang dengan isi array items

  res.status(201).json({
    message: "Data diubah!",
  });
};

// middleware hapus data
exports.deleteItem = (req, res) => {
  const { id } = req.params;

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

  const item = items.find((item) => item.id === parseInt(id));
  // variabel item berisi salah satu object dari items.json
  // berdasarkan id yg sama dengan id parameter url

  const filtereditems = items.filter((item) => item.id !== parseInt(id));
  // variabel items berisi semua object dari items.json yang dibungkus array
  // kecuali salah satu object yg memiliki id yg sama dengan id parameter url
  // misal { id: 3, nama: 'Penghapus' },

  // hasil

  /* filtereditems =
  [
    { id: 1, nama: 'Pensil' },
    { id: 2, nama: 'Pulpen' },    disingkirkan!
                        ==========> { id: 3, nama: 'Penghapus' },
    { id: 4, nama: 'Kamus' },
    { id: 5, nama: 'Peta' } 
  ]
  */

  if (!item)
    // tidak bisa di kunci pakai const filtereditems kerena return-nya selalu ada,
    // meskipun object yg memiliki id yg sama dengan id parameter url tidak ada

    // kalo mau if (JSON.stringify(filtereditems) === JSON.stringify(items))
    // biar bisa baca arraynya (bukan pointer dalam memory)
    // maka parse dulu arraynya jadi string

    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  save("items", filtereditems);
  // file json di tulis ulang dengan isi array filteredItems

  res.status(200).json({
    message: "Data dihapus!",
  });
};

// middleware cari data di file joins.json
exports.searchItem = (req, res) => {
  const { nama } = req.body;

  const joins = load("joins");
  const items = load("items");
  const storages = load("storages");

  const searchItems = items.find((item) => item.nama === nama);
  if (!searchItems)
    return res.status(200).json({
      message: "Data tidak ditemukan!",
    });

  const searchJoins = joins.find((join) =>
    join.items.some((item) => item === searchItems.id)
  );
  if (!searchJoins)
    return res.status(200).json({
      message: "Data tidak ditemukan!",
    });

  const isiSearchItems = searchJoins.items.map((search) =>
    items.find((item) => item.id === search)
  );
  const isiSearchStorages = storages.find(
    (storage) => storage.id === searchJoins.storages
  );

  const view = {
    id: searchJoins.id,
    storages: isiSearchStorages,
    items: isiSearchItems,
  };

  res.status(200).json({
    message: "Data ketemu!",
    result: view,
  });
};
