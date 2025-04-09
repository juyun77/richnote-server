const { SalesRecord, Product } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

// ✅ 매출 업로드
exports.uploadSales = async (req, res) => {
  try {
    const { storeId, data } = req.body;

    if (!storeId || !Array.isArray(data)) {
      return res
        .status(400)
        .json({ msg: "필수 값 누락 또는 잘못된 형식입니다." });
    }

    if (data.length === 0) {
      return res.status(400).json({ msg: "업로드할 데이터가 없습니다." });
    }

    const uploadDate = data[0].date; // ✅ 업로드하는 데이터의 날짜 사용

    // ✅ 업로드 전에 (storeId + date) 중복 체크
    const existingRecords = await SalesRecord.findOne({
      where: {
        storeId,
        date: uploadDate,
      },
    });

    if (existingRecords) {
      return res
        .status(409)
        .json({ msg: "이미 해당 날짜에 업로드된 데이터가 있습니다." });
    }

    const records = data
      .filter((row) => row["상품명"] || row["productName"]) // ✅ 상품명 없는 행 제거
      .map((row) => ({
        storeId,
        date: row["날짜"] || row["date"],
        productName: row["상품명"] || row["productName"],
        quantity:
          parseInt(row["판매수량"] || row["수량"] || row["quantity"]) || 0,
        totalPrice:
          parseInt(row["판매금액"] || row["합계"] || row["totalPrice"]) || 0,
        costPrice: parseInt(row["매입금액"] || row["costPrice"]) || 0,
        profitPrice: parseInt(row["수익금액"] || row["profitPrice"]) || 0,
        barcode: row["바코드"] || row["barcode"] || null,
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

// ✅ 문자열 유사도 비교 함수
function similarity(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  let longer = str1.length > str2.length ? str1 : str2;
  let shorter = str1.length > str2.length ? str2 : str1;
  let commonLength = 0;

  for (let char of shorter) {
    if (longer.includes(char)) commonLength++;
  }
  return commonLength / longer.length;
}

// ✅ 재고 자동 차감
exports.autoDeductStock = async (req, res) => {
  const { storeId, salesData } = req.body;

  if (!storeId || !salesData) {
    return res
      .status(400)
      .json({ message: "storeId와 salesData가 필요합니다." });
  }

  const errors = [];
  const transaction = await sequelize.transaction();

  try {
    for (const sale of salesData) {
      const { productName, quantity } = sale;
      if (!productName || !quantity) continue;

      // 매장 재고 가져오기
      const products = await Product.findAll({
        where: { storeId },
        transaction,
      });

      let bestMatch = null;
      let bestScore = 0;

      for (const product of products) {
        const score = similarity(productName, product.name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = product;
        }
      }

      if (bestMatch && bestScore >= 0.5) {
        if (bestMatch.quantity >= quantity) {
          await bestMatch.update(
            { quantity: bestMatch.quantity - quantity },
            { transaction }
          );
        } else {
          errors.push({ productName, reason: "재고 부족" });
        }
      } else {
        errors.push({ productName, reason: "매칭 실패" });
      }
    }

    await transaction.commit();

    if (errors.length > 0) {
      return res.status(207).json({
        message: "일부 실패",
        errors, // 👈 실패 리스트 같이 보냄!
      });
    } else {
      return res.status(200).json({
        message: "모든 재고 차감 성공",
        errors: [], // 성공했으면 errors는 빈 배열
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};
