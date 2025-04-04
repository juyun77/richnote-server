// models/store.js
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      storeName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      deposit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      premium: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      monthlyRent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maintenanceFee: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      initialInvestment: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "stores",
      timestamps: false, // 수동 관리
    }
  );

  return Store;
};
