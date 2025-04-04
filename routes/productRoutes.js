const express = require("express");
const router = express.Router();
const productController = require("../controllers/Cproduct");

router.post("/", productController.createProduct);
router.get("/:storeId", productController.getProductsByStore);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/update", productController.bulkUpdateProducts);

module.exports = router;
