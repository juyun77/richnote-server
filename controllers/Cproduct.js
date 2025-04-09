// controllers/productController.js

const { Product } = require("../models");
const { Op } = require("sequelize");

// ✅ 새 상품 등록 (bulk insert)
exports.createProduct = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "배열 형식의 상품 리스트가 필요합니다." });
    }

    const calculated = products.map((p) => {
      const profit = p.salePrice - p.costPrice;
      const marginRate =
        p.salePrice === 0
          ? 0
          : Number(((profit / p.salePrice) * 100).toFixed(2));

      return {
        ...p,
        profit,
        marginRate,
      };
    });

    const created = await Product.bulkCreate(calculated, {
      updateOnDuplicate: [
        "name",
        "quantity",
        "costPrice",
        "salePrice",
        "profit",
        "marginRate",
      ],
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("❌ 상품 등록 실패:", error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ 특정 매장의 상품 전체 조회 (페이지네이션 + 검색)
exports.getProductsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const whereCondition = { storeId };

    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [["id", "ASC"]],
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      products: rows,
    });
  } catch (error) {
    console.error("❌ 상품 목록 조회 실패:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ 단일 상품 수정
exports.updateProduct = async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "상품 수정 완료" });
  } catch (error) {
    console.error("❌ 상품 수정 실패:", error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ 단일 상품 삭제
exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "상품 삭제 완료" });
  } catch (error) {
    console.error("❌ 상품 삭제 실패:", error);
    res.status(400).json({ error: error.message });
  }
};

// ✅ 상품 일괄 수정
exports.bulkUpdateProducts = async (req, res) => {
  try {
    const products = req.body;

    for (const product of products) {
      const profit = product.salePrice - product.costPrice;
      const marginRate =
        product.salePrice > 0
          ? parseFloat(((profit / product.salePrice) * 100).toFixed(2))
          : 0;

      await Product.update(
        {
          name: product.name,
          quantity: product.quantity,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          profit,
          marginRate,
        },
        {
          where: { id: product.id },
        }
      );
    }

    res.status(200).json({ message: "상품 일괄 수정 완료" });
  } catch (error) {
    console.error("❌ 상품 일괄 수정 실패:", error);
    res.status(500).json({ error: "상품 수정 중 오류 발생" });
  }
};
