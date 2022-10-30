// import module buatan sendiri
const { load, save } = require("../config/modify");

// middleware tampil semua data
exports.getStorages = (req, res) => {
  const storages = load("storages");

  if (storages.length == 0)
    return res.status(404).json({
      message: "Data masih kosong!",
    });

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    storages,
  });
};

// middleware tampil salah satu data
// berdasarkan id dari parameter url
exports.getStorageById = (req, res) => {
  const { id } = req.params;

  const storages = load("storages");
  const storage = storages.find((storage) => storage.id === parseInt(id));

  if (!storage)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    storage,
  });
};

// middleware tambah data
exports.addStorage = (req, res) => {
  const { nama } = req.body;

  const storages = load("storages");
  const storage = storages.at(-1);
  const id = storage ? storage.id + 1 : 1;

  storages.push({ id, nama });
  save("storages", storages);

  res.status(201).json({
    message: "Data ditambahkan!",
  });
};

// middleware ubah data
exports.updateStorage = (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  const storages = load("storages");
  const storage = storages.find((storage) => storage.id === parseInt(id));
  const index = storages.findIndex((storage) => storage.id === parseInt(id));

  if (!storage)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  storages[index].nama = nama;
  save("storages", storages);

  res.status(201).json({
    message: "Data diubah!",
  });
};

// middleware hapus data
exports.deleteStorage = (req, res) => {
  const { id } = req.params;

  const storages = load("storages");
  const storage = storages.find((storage) => storage.id === parseInt(id));
  const filteredstorages = storages.filter(
    (storage) => storage.id !== parseInt(id)
  );

  if (!storage)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  save("storages", filteredstorages);

  res.status(200).json({
    message: "Data dihapus!",
  });
};

// middleware cari data di file joins.json
exports.searchStorage = (req, res) => {
  const { nama } = req.body;

  const joins = load("joins");
  const items = load("items");
  const storages = load("storages");

  const searchStorages = storages.find((storage) => storage.nama === nama);
  if (!searchStorages)
    return res.status(200).json({
      message: "Data tidak ditemukan!",
    });

  const searchJoins = joins.find((join) => join.storages === searchStorages.id);
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
