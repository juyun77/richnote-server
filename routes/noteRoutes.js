const express = require("express");
const router = express.Router();
const noteController = require("../controllers/Cnote");

// 메모 목록 조회
router.get("/:storeId/:year/:month", noteController.getNotes);

// 메모 추가
router.post("/", noteController.addNote);

// 메모 삭제
router.delete("/:noteId", noteController.deleteNote);

module.exports = router;
