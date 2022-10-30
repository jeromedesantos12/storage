// import module local
const prompt = require("../config/Query");

// middleware tampil semua data
exports.readStorages = async (req, res) => {
  try {
    const storages = await prompt(`CALL read_storages()`);
    if (storages[0].length === 0)
      return res.status(404).json({
        message: "Data masih kosong!",
      });
    res.status(200).json({
      message: "Data berhasil ditampilkan!",
      storages: storages[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware tampil salah satu data berdasarkan id dari parameter url
exports.readStorageById = async (req, res) => {
  try {
    const { id } = req.params;
    const storage = await prompt(`CALL read_storagesID("${id}")`);
    if (storage[0].length === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil ditampilkan!",
      storage: storage[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware cari data di parent
exports.searchStorage = async (req, res) => {
  try {
    const { nama } = req.body;

    const sql_search_joins = await prompt(`CALL read_joinsNama ("${nama}")`);
    if (sql_search_joins[0].length === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    const sql_joins = await prompt(
      `CALL read_joinsID (${sql_search_joins[0][0].id})`
    );

    // console.log(sql_search_joins);
    // console.log(sql_joins);

    // joins x joins_items
    const joins = await Promise.all(
      sql_joins[0].map(async (join) => {
        const id_join = join.id;

        const id_storages = join.storages_id;
        const nama_storages = join.storages_nama;

        const item = await prompt(`CALL read_joins_itemsID ("${join.id}")`);
        const items = item[0].map((i) => {
          const id = i.items_id;
          const nama = i.items_nama;
          return { id, nama };
        });

        return {
          id: id_join,
          storages: { id: id_storages, nama: nama_storages },
          items,
        };
      })
    );

    res.status(200).json({
      message: "Data berhasil temukan!",
      joins,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware tambah data
exports.createStorage = async (req, res) => {
  try {
    const { nama } = req.body;
    const createdStorage = await prompt(`CALL create_storages("${nama}")`);
    res.status(200).json({
      message: "Data berhasil dibuat!",
      createdStorage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware ubah data
exports.updateStorage = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    const updatedStorage = await prompt(
      `CALL update_storages("${id}", "${nama}")`
    );
    if (updatedStorage.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil diubah!",
      updatedStorage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware hapus data
exports.deleteStorage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStorage = await prompt(`CALL delete_storages("${id}")`);
    if (deletedStorage.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil hapus!",
      deletedStorage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
