const { Store } = require("../models");

exports.createStore = async (req, res) => {
  try {
    console.log(req.body);
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStoresByUser = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { userId: req.params.userId },
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    await Store.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Store updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    await Store.destroy({ where: { id: req.params.id } });
    res.json({ message: "Store deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store)
      return res.status(404).json({ msg: "매장을 찾을 수 없습니다." });
    res.json(store);
  } catch (error) {
    console.error("매장 조회 실패:", error);
    res.status(500).json({ msg: "서버 오류" });
  }
};
