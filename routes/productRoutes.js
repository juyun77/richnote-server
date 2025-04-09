const express = require("express");
const router = express.Router();
const productController = require("../controllers/Cproduct");

// 상품 등록 (엑셀 업로드)
router.post("/", productController.createProduct);

// 매장별 상품 조회
router.get("/:storeId", productController.getProductsByStore);

// 상품 개별 수정
router.put("/:id", productController.updateProduct);

// 상품 개별 삭제
router.delete("/:id", productController.deleteProduct);

// 상품 일괄 저장 (수정)
router.post("/update", productController.bulkUpdateProducts);

module.exports = router;
