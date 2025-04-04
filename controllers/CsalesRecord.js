const { SalesRecord } = require("../models");
const { Op } = require("sequelize");

// ✅ 매출 업로드
exports.uploadSales = async (req, res) => {
  try {
    const { storeId, data } = req.body;

    if (!storeId || !Array.isArray(data)) {
      return res
        .status(400)
        .json({ msg: "필수 값 누락 또는 잘못된 형식입니다." });
    }

    const records = data.map((row) => ({
      storeId,
      date: row["날짜"] || row["date"],
      productName: row["상품명"] || row["productName"],
      quantity: parseInt(row["수량"] || row["quantity"]) || 0,
      totalPrice: parseInt(row["합계"] || row["totalPrice"]) || 0,
    }));

    const saved = await SalesRecord.bulkCreate(records);
    res.status(201).json({ msg: "매출 데이터 저장 완료", count: saved.length });
  } catch (error) {
    console.error("매출 업로드 오류:", error);
    res.status(500).json({ msg: "서버 오류" });
  }
};

// ✅ 기간별 조회
exports.getSalesByRange = async (req, res) => {
  try {
    const { storeId, startDate, endDate } = req.query;

    if (!storeId || !startDate || !endDate) {
      return res.status(400).json({ msg: "쿼리 파라미터 누락" });
    }

    const records = await SalesRecord.findAll({
      where: {
        storeId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [
        ["date", "ASC"],
        ["productName", "ASC"],
      ],
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("기간 조회 오류:", error);
    res.status(500).json({ msg: "서버 오류" });
  }
};
