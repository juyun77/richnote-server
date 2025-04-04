const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const app = express();
const PORT = process.env.PORT;
const prefix = "/api";

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost:3001", // 프론트엔드 주소
    credentials: true, // 쿠키 전달 허용
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // 세션 암호화 키
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS 적용 시 true
      maxAge: 1000 * 60 * 60 * 24, // 1일 유지
    },
  })
);

//라우터 설정
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRecordRoutes = require("./routes/salesRecordRoutes");
const veRoutes = require("./routes/variableExpenseRoutes");

// 라우터 연결
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/stores`, storeRoutes);
app.use(`${prefix}/products`, productRoutes);
app.use(`${prefix}/sales`, salesRecordRoutes);
app.use(`${prefix}/variable-expense`, veRoutes);

// 기본 테스트용 엔드포인트
app.get("/", (req, res) => {
  res.send("🚀 Server is running with session middleware!");
});

// DB 연결 및 서버 실행
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❗ Database sync 오류:", err);
  });
//env 파일 수정
