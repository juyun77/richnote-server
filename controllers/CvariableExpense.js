const { VariableExpense } = require("../models");
const { Op } = require("sequelize"); // Op 추가

//  생성 (bulk insert)
// 중복된 항목은 amount만 업데이트 (storeId + year + month + name 기준)
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ msg: "저장할 데이터가 없습니다." });
    }

    // bulkCreate로 한번에 저장 + 중복 시 amount 업데이트
    await VariableExpense.bulkCreate(data, {
      updateOnDuplicate: ["amount"], // ✅ 중복이면 amount만 업데이트
    });

    res.status(201).json({ msg: "변동 지출 저장 완료" });
  } catch (err) {
    console.error("변동 지출 저장 오류:", err);
    res.status(500).json({ msg: "변동 지출 저장 실패" });
  }
};

//  월별 조회 (storeId + year + month로 필터링)
exports.getByMonth = async (req, res) => {
  const { storeId, year, month } = req.params;

  try {
    if (!storeId || !year || !month) {
      return res.status(400).json({ msg: "필수 파라미터 누락" });
    }

    const items = await VariableExpense.findAll({
      where: {
        storeId,
        year,
        month,
      },
      order: [["id", "ASC"]],
    });

    res.status(200).json(items);
  } catch (err) {
    console.error("변동 지출 조회 오류:", err);
    res.status(500).json({ msg: "변동 지출 조회 실패" });
  }
};

// 개별 삭제 (id 기준)
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await VariableExpense.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ msg: "존재하지 않는 항목입니다." });
    }

    res.status(200).json({ msg: "변동 지출 삭제 완료" });
  } catch (err) {
    console.error("변동 지출 삭제 오류:", err);
    res.status(500).json({ msg: "변동 지출 삭제 실패" });
  }
};

// 개별 수정 (id 기준 업데이트)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, amount, storeId, year, month } = req.body;

  try {
    const [updatedCount] = await VariableExpense.update(
      { name, amount, storeId, year, month },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ msg: "수정할 항목이 없습니다." });
    }

    res.status(200).json({ msg: "변동 지출 수정 완료" });
  } catch (err) {
    console.error("변동 지출 수정 오류:", err);
    res.status(500).json({ msg: "변동 지출 수정 실패" });
  }
};
