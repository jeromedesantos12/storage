// import module bawaan
const fs = require("fs");

// letak folder
const dirPath = "./data";

// letak file json
const dataPath_storage = "./data/storages.json";
const dataPath_item = "./data/items.json";
const dataPath_join = "./data/joins.json";

// pengkondisian utk buat folder baru
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

// pengkondisian utk buat file baru, isinya array kosong
if (!fs.existsSync(dataPath_storage)) fs.writeFileSync(dataPath_storage, "[]");
if (!fs.existsSync(dataPath_item)) fs.writeFileSync(dataPath_item, "[]");
if (!fs.existsSync(dataPath_join)) fs.writeFileSync(dataPath_join, "[]");
