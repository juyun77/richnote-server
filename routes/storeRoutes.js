const express = require("express");
const router = express.Router();
const storeController = require("../controllers/Cstore");

router.post("/", storeController.createStore);
router.get("/:userId", storeController.getStoresByUser);
router.patch("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);
router.get("/detail/:id", storeController.getStoreById);

module.exports = router;
