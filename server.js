const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

// dotenv 설정
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const app = express();
const PORT = process.env.PORT || 8080;
const prefix = "/api";

// DB 연결 옵션 (환경에 따라 다르게)
const dbOptions = {
  host:
    process.env.NODE_ENV === "production"
      ? process.env.DB_PROD_HOST
      : process.env.DB_HOST,
  user:
    process.env.NODE_ENV === "production"
      ? process.env.DB_PROD_USERNAME
      : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV === "production"
      ? process.env.DB_PROD_PASSWORD
      : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === "production"
      ? process.env.DB_PROD_DATABASE
      : process.env.DB_DATABASE,
};

// 세션 스토어
const sessionStore = new MySQLStore(dbOptions);

// 미들웨어
app.use(
  cors({
    origin: ["http://13.124.25.138", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // ✅ 세션 저장 위치를 MySQL로 지정
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS 적용하면 true로 변경
      maxAge: 1000 * 60 * 60 * 24, // 1일
    },
  })
);

// 라우터
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRecordRoutes = require("./routes/salesRecordRoutes");
const veRoutes = require("./routes/variableExpenseRoutes");
const noteRoutes = require("./routes/noteRoutes");

app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/stores`, storeRoutes);
app.use(`${prefix}/products`, productRoutes);
app.use(`${prefix}/sales`, salesRecordRoutes);
app.use(`${prefix}/variable-expense`, veRoutes);
app.use(`${prefix}/note`, noteRoutes);

// 테스트용
app.get("/", (req, res) => {
  res.send("✅ 서버 정상 동작중 (세션 MySQL 저장)");
});

// DB 연결 및 서버 시작
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync error:", err);
  });
