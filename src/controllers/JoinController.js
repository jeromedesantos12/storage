// import module buatan sendiri
const { load, save } = require("../config/modify");

// middleware tampil semua data yg sudah di join
exports.getJoins = (req, res) => {
  const joins = load("joins");
  // variabel joins berisi semua object dari joins.json yang dibungkus array

  const items = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array

  const storages = load("storages");
  // variabel storages berisi semua object dari storages.json yang dibungkus array

  if (joins.length == 0)
    return res.status(404).json({
      message: "Data masih kosong!",
    });

  const views = joins.map((join) => {
    /* join =

      { id: 1, storages: 1, items: [ 1, 2 ] }
      { id: 2, storages: 2, items: [ 3 ] }
      { id: 3, storages: 3, items: [ 4, 5 ] }
    */

    const id = join.id;
    /* id =

      1
      2
      3
    */

    const storages_id = join.storages;
    /* storages_id =

      1
      2
      3
    */

    const items_id = join.items;
    /* items_id =

      [ 1, 2 ]
      [ 3 ]
      [ 4, 5 ]
    */

    const storages_contents = storages.find(
      (storage) => storage.id === storages_id
    );
    /* storages_contents =

      { id: 1, nama: 'Kardus A' }
      { id: 2, nama: 'Kardus B' }
      { id: 3, nama: 'Kardus C' }
    */

    // "apakah isi items yang ada di items.id sama dgn req.body.items joins?"
    const items_contents = items_id.map((itemId) =>
      items.find((item) => item.id === itemId)
    );
    /* items_contents =

      [ { id: 1, nama: 'Pensil' }, { id: 2, nama: 'Pulpen' } ]
      [ { id: 3, nama: 'Penghapus' } ]
      [ { id: 4, nama: 'Kamus' }, { id: 5, nama: 'Peta' } ]  
    */

    // bisa langsung di filter (dengan catatan items nggak boleh kembar)
    // cara kerja includes sama saja dengan find (masalahnya filter nggak bisa diulang 2 kali, find bisa)
    const items_contents2 = items.filter((item) => items_id.includes(item.id));

    /* cara kerja map!

      kalo map lalu find, 
      dia pecah dulu isi arraynya, lalu di find satu-satu
      misal: ada data yang muncul 2 kali (id: 1) ya dia ketangkep semua
      [ { id: 1, nama: 'Pensil A' }, { id: 1, nama: 'Pensil B' }, { id: 2, nama: 'Pulpen' } ] 
    
      kalo filter lalu find cuma satu data saja yang dapat
      filter array berdasarkan data yang di dapat dari find
      [ { id: 1, nama: 'Pensil A' }, { id: 2, nama: 'Pulpen' } ] 

      sederhananya seperti filter dia semua data di buang beberapa data yang nggak perlu
      kalo find dia ada data lalu di ambil data yang perlu aja, karena
      sudah pasti yang punya semua data, punyanya lebih banyak
    */

    return {
      id,
      storages: storages_contents,
      items: items_contents,
    };
  });
  /* views =
    [
      { id: 1, storages: 'Kardus A', items: [ 'Pensil', 'Pulpen' ] },
      { id: 2, storages: 'Kardus B', items: [ 'Penghapus' ] },
      { id: 3, storages: 'Kardus C', items: [ 'Kamus', 'Peta' ] }
    ]
  */

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    joins: views, // tampilin disini
  });
};

// middleware tampil salah satu data yang sudah di join
// berdasarkan id dari parameter url
exports.getJoinById = (req, res) => {
  const { id } = req.params;

  const joins = load("joins");
  // variabel joins berisi semua object dari joins.json yang dibungkus array

  const items = load("items");
  // variabel items berisi semua object dari items.json yang dibungkus array

  const storages = load("storages");
  // variabel storages berisi semua object dari storages.json yang dibungkus array

  const join = joins.find((join) => join.id === parseInt(id));
  // variabel joins berisi salah satu object dari joins.json
  // berdasarkan id yg sama dengan id parameter url
  /* join = misal id: 2

      { id: 1, storages: 1, items: [ 1, 2 ] }
  */

  if (!join)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  const storages_contents = storages.find(
    (storage) => storage.id === join.storages
  );
  /* storages_contents =

      { id: 1, nama: 'Kardus A' }
  */

  const items_contents = join.items.map((itemId) =>
    items.find((item) => item.id === itemId)
  );
  /* items_contents =
    [ 
      { id: 1, nama: 'Pensil' }, 
      { id: 2, nama: 'Pulpen' } 
    ]
  */

  const view = {
    id: join.id,
    storages: storages_contents,
    items: items_contents,
  };
  /* views =

    { id: 1, storages: 'Kardus A', items: [ 'Pensil', 'Pulpen' ] }
  */

  res.status(200).json({
    message: "Data berhasil ditampilkan!",
    join: view,
  });
};

// utk add, update dan delete sama aja!

// middleware tambah data
exports.addJoin = (req, res) => {
  const { storages, items } = req.body;

  const joins = load("joins");
  const join = joins.at(-1);
  const id = join ? join.id + 1 : 1;

  joins.push({ id, storages, items });
  save("joins", joins);

  res.status(201).json({
    message: "Data ditambahkan!",
  });
};

// middleware ubah data
exports.updateJoin = (req, res) => {
  const { id } = req.params;
  const { storages, items } = req.body;

  const joins = load("joins");
  const join = joins.find((join) => join.id === parseInt(id));
  const index = joins.findIndex((join) => join.id === parseInt(id));

  if (!join)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  joins[index].storages = storages;
  joins[index].items = items;
  save("joins", joins);

  res.status(201).json({
    message: "Data diubah!",
  });
};

// middleware hapus data
exports.deleteJoin = (req, res) => {
  const { id } = req.params;

  const joins = load("joins");
  const join = joins.find((join) => join.id === parseInt(id));
  const filteredjoins = joins.filter((join) => join.id !== parseInt(id));

  if (!join)
    return res.status(404).json({
      message: "Data tidak ditemukan!",
    });

  save("joins", filteredjoins);

  res.status(200).json({
    message: "Data dihapus!",
  });
};
