// middleware route 404 (not found)
exports.useError = (req, res) => {
  res.status(404).json({
    message: "URL tidak ditemukan!",
  });
};
