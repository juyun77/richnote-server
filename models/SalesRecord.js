module.exports = (sequelize, DataTypes) => {
  const SalesRecord = sequelize.define(
    "SalesRecord",
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costPrice: {
        // ✅ 매입금액 (추가)
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profitPrice: {
        // ✅ 수익금액 (추가)
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      barcode: {
        // ✅ 바코드 (추가)
        type: DataTypes.STRING(50),
        allowNull: true, // 경우에 따라 없을 수도 있으니 allowNull: true
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return SalesRecord;
};
