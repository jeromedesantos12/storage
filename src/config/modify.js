// import module bawaan
const fs = require("fs");

// untuk ambil data dari file json ke variabel yg nanti kita buat
// JSON.parse => ubah string ke object
// utf-8 => ubah buffer ke string
exports.load = (data) =>
  JSON.parse(fs.readFileSync(`./data/${data}.json`, "utf-8"));

// untuk ambil data dari variabel ke file json
// JSON.stringify => ubah object ke string
exports.save = (data, input) =>
  fs.writeFileSync(`./data/${data}.json`, JSON.stringify(input));

/* 
 format buffer:
    Nathan-Camposs-MacBook-Pro:node_test Nathan$ node main.js
    <Buffer 54 65 73 74 69 6e 67 20 4e 6f 64 65 2e 6a 73 20 72 65 61 64 46 69 6c 65 28 29>
    Nathan-Camposs-MacBook-Pro:node_test Nathan$ 
*/
