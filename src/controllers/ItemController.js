// import module local
const prompt = require("../config/Query");

// middleware tampil semua data
exports.readItems = async (req, res) => {
  try {
    const items = await prompt(`CALL read_items()`);
    if (items[0].length === 0)
      return res.status(404).json({
        message: "Data masih kosong!",
      });
    res.status(200).json({
      message: "Data berhasil ditampilkan!",
      items: items[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware tampil salah satu data berdasarkan id dari parameter url
exports.readItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prompt(`CALL read_itemsID("${id}")`);
    if (item[0].length === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil ditampilkan!",
      item: item[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware cari data di parent
exports.searchItem = async (req, res) => {
  try {
    const { nama } = req.body;

    // cuma 1 data yang muncul, yaitu data yang dicari
    const sql_search_joins_items = await prompt(
      `CALL read_joins_itemsNama ("${nama}")`
    );
    if (sql_search_joins_items[0].length === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    const sql_joins = await prompt(
      `CALL read_joinsID ("${sql_search_joins_items[0][0].joins_id}")`
    );

    // console.log(sql_search_joins_items);
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
exports.createItem = async (req, res) => {
  try {
    const { nama } = req.body;
    const createdItem = await prompt(`CALL create_items("${nama}")`);
    res.status(200).json({
      message: "Data berhasil dibuat!",
      createdItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware ubah data
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    const updatedItem = await prompt(`CALL update_items("${id}", "${nama}")`);
    if (updatedItem.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil diubah!",
      updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware hapus data
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await prompt(`CALL delete_items("${id}")`);
    if (deletedItem.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil hapus!",
      deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
