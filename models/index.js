const Sequelize = require("sequelize");
const db = {};
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Sequelize 객체 등록
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 불러오기
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Store = require("./Store")(sequelize, Sequelize.DataTypes);
db.Product = require("./Product")(sequelize, Sequelize.DataTypes);
db.SalesRecord = require("./SalesRecord")(sequelize, Sequelize.DataTypes);
db.VariableExpense = require("./VariableExpense")(
  sequelize,
  Sequelize.DataTypes
);

// 관계 설정
// 1. User - Store (1:N)
db.User.hasMany(db.Store, { foreignKey: "userId", onDelete: "CASCADE" });
db.Store.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });

// 2. Store - Product (1:N)
db.Store.hasMany(db.Product, { foreignKey: "storeId", onDelete: "CASCADE" });
db.Product.belongsTo(db.Store, { foreignKey: "storeId", onDelete: "CASCADE" });

// 3. Store - SalesRecord (1:N)
db.Store.hasMany(db.SalesRecord, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});
db.SalesRecord.belongsTo(db.Store, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});

// 4. Store - VariableExpense (1:N)
db.Store.hasMany(db.VariableExpense, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});
db.VariableExpense.belongsTo(db.Store, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});

module.exports = db;
