const express = require("express");
const router = express.Router();
const salesController = require("../controllers/CsalesRecord");

router.post("/upload", salesController.uploadSales);
router.get("/", salesController.getSalesByRange);

module.exports = router;
