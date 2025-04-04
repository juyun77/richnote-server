// controllers/productController.js
const { Product } = require("../models");

// controllers/Cproduct.js
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

    // 핵심: 이미 있는 건 업데이트, 없으면 삽입
    const created = await Product.bulkCreate(calculated, {
      updateOnDuplicate: [
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

exports.getProductsByStore = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { storeId: req.params.storeId },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("데이터 받아오나요?", req.body);
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.bulkUpdateProducts = async (req, res) => {
  const products = req.body;

  console.log("저장해야하는데!!", products);

  try {
    for (const product of products) {
      const profit = product.salePrice - product.costPrice;
      const marginRate =
        product.salePrice > 0
          ? parseFloat(((profit / product.salePrice) * 100).toFixed(2))
          : 0;

      await Product.update(
        {
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
    console.error("상품 일괄 수정 오류:", error);
    res.status(500).json({ error: "상품 수정 중 오류 발생" });
  }
};
