const express = require("express");
const router = express.Router();
const salesController = require("../controllers/CsalesRecord");

router.post("/upload", salesController.uploadSales);
router.get("/", salesController.getSalesByRange);

// ✅ 여기에 재고 자동 차감 추가
router.post("/auto-deduct", salesController.autoDeductStock);

module.exports = router;
