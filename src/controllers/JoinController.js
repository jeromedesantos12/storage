// import module local
const prompt = require("../config/Query");

// middleware tampil semua data yg sudah di join
exports.readJoins = async (req, res) => {
  try {
    const sql_joins = await prompt(`CALL read_joins()`);

    if (sql_joins[0].length === 0)
      return res.status(404).json({
        message: "Data masih kosong!",
      });

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
      message: "Data berhasil ditampilkan!",
      joins,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware tampil salah satu data yang sudah di join berdasarkan id dari parameter url
exports.readJoinById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql_joins = await prompt(`CALL read_joinsID ("${id}")`);

    if (sql_joins[0].length === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

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
      message: "Data berhasil ditampilkan!",
      joins,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware tambah data
exports.createJoin = async (req, res) => {
  try {
    const { storages, items } = req.body;

    // joins
    const createdJoins = await prompt(`CALL create_joins("${storages}")`);

    // joins_items => input dengan looping dari array req.body.items
    const createdJoins_items = await Promise.all(
      items.map(
        async (item) => await prompt(`CALL create_joins_items("${item}")`)
      )
    );

    res.status(200).json({
      message: "Data berhasil dibuat!",
      createdJoins,
      createdJoins_items,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware ubah data
exports.updateJoin = async (req, res) => {
  try {
    const { id } = req.params;
    const { storages, items } = req.body;

    // joins
    const updatedJoins = await prompt(
      `CALL update_joins("${id}", "${storages}")`
    );

    if (updatedJoins.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    // joins_items => input dengan looping dari array req.body.items
    const updatedJoins_items = await Promise.all(
      items.map(
        async (item) =>
          await prompt(`CALL update_joins_items("${id}", "${item}")`)
      )
    );

    res.status(200).json({
      message: "Data berhasil diubah!",
      updatedJoins,
      updatedJoins_items,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// middleware hapus data
exports.deleteJoin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJoins = await prompt(`CALL delete_joins("${id}")`);
    if (deletedJoins.affectedRows === 0)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });
    res.status(200).json({
      message: "Data berhasil hapus!",
      deletedJoins,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
