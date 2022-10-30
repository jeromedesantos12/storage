// middleware beranda
exports.getHome = (req, res) => {
  res.status(200).json({
    message: "Selamat datang di Rest API saya!",
  });
};
