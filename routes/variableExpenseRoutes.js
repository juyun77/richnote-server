const express = require("express");
const router = express.Router();
const variableExpense = require("../controllers/CvariableExpense");

router.post("/", variableExpense.create);
router.get("/:storeId/:year/:month", variableExpense.getByMonth);
router.delete("/:id", variableExpense.delete);
router.put("/:id", variableExpense.update);

module.exports = router;
