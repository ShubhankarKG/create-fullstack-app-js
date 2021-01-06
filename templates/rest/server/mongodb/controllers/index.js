module.exports = {
  getIndex(req, res) {
    res.status(200).json({ message: "Hello World!" });
  },
};
