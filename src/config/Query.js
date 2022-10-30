// import module local
const db = require("./Database");

// konversikan callback menjadi promise untuk dapat isinya
const prompt = (sql) =>
  new Promise((resolve, reject) => {
    db.query(sql, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

// export module
module.exports = prompt;
