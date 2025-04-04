const { VariableExpense } = require("../models");

// ✅ 생성 (bulk insert)
// ✅ 중복된 항목은 무시하거나 amount만 업데이트
exports.create = async (req, res) => {
  try {
    await VariableExpense.bulkCreate(req.body, {
      updateOnDuplicate: ["amount"], // name이 같으면 amount만 업데이트
    });
    res.status(201).json({ msg: "저장 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "저장 실패" });
  }
};

// ✅ 월별 조회
exports.getByMonth = async (req, res) => {
  const { storeId, year, month } = req.params;
  try {
    const items = await VariableExpense.findAll({
      where: { storeId, year, month },
      order: [["id", "ASC"]],
    });
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "조회 실패" });
  }
};

// ✅ 개별 삭제
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await VariableExpense.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).json({ msg: "존재하지 않는 항목입니다." });
    }
    res.json({ msg: "삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "삭제 실패" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, amount, storeId, year, month } = req.body;

  try {
    await VariableExpense.update(
      { name, amount, storeId, year, month },
      { where: { id } }
    );
    res.status(200).json({ message: "수정 완료" });
  } catch (err) {
    console.error("변동 지출 수정 오류:", err);
    res.status(500).json({ error: "수정 중 오류 발생" });
  }
};
