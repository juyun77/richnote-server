// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/Cuser");

router.get("/kakao", controller.kakaoAuthRedirect);
router.get("/kakao/callback", controller.kakaoAuthCallback);
router.get("/checkLogin", controller.checkLogin);

module.exports = router;
