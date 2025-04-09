// controllers/userController.js

const axios = require("axios");
const { User } = require("../models");

exports.kakaoAuthRedirect = (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
  res.redirect(kakaoAuthURL);
};

exports.kakaoAuthCallback = async (req, res) => {
  const code = req.query.code;

  try {
    if (!req.session) {
      throw new Error("세션 미들웨어가 정상 작동하지 않습니다.");
    }

    // ✅ 카카오 토큰 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = tokenResponse.data;

    // ✅ 카카오 사용자 정보 가져오기
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoUser = userResponse.data;

    // ✅ 사용자 DB 저장 또는 조회
    const [user] = await User.findOrCreate({
      where: { kakaoId: kakaoUser.id },
      defaults: {
        kakaoId: kakaoUser.id,
        nickname: kakaoUser.properties.nickname,
      },
    });

    // ✅ 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      nickname: user.nickname,
    };

    // ✅ 세션 저장 후 리다이렉트
    req.session.save((err) => {
      if (err) {
        console.error("세션 저장 실패:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=session_save_failed`
        );
      }
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  } catch (err) {
    console.error("카카오 로그인 실패:", err.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// ✅ 로그인 상태 확인
exports.checkLogin = (req, res) => {
  if (req.session?.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
};

// ✅ (추가) 로그아웃
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 실패:", err);
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid"); // 세션 쿠키 삭제
    res.json({ message: "로그아웃 성공" });
  });
};
