// models/product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      storageType: {
        type: DataTypes.STRING(20), // 냉동, 실온 등
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      marginRate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["storeId", "name"], // 매장별 상품명 중복 방지
        },
      ],
    }
  );

  return Product;
};
