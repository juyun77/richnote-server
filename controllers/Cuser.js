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
      throw new Error(
        "세션이 초기화되지 않았습니다. express-session 미들웨어 설정을 확인하세요."
      );
    }

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

    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoUser = userResponse.data;

    const [user, created] = await User.findOrCreate({
      where: { kakaoId: kakaoUser.id },
      defaults: {
        kakaoId: kakaoUser.id,
        nickname: kakaoUser.properties.nickname,
      },
    });

    req.session.user = {
      id: user.id,
      nickname: user.nickname,
    };

    req.session.save((err) => {
      if (err) {
        console.error("세션 저장 오류:", err);
      }
      res.redirect("http://localhost:3001/");
    });
  } catch (err) {
    console.error("카카오 로그인 실패:", err);
    res.redirect("http://localhost:3001/login?error=auth_failed");
  }
};

exports.checkLogin = (req, res) => {
  if (req.session?.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
};
