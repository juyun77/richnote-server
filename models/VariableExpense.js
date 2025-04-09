module.exports = (sequelize, DataTypes) => {
  const VariableExpense = sequelize.define(
    "VariableExpense",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "해당 지출이 속한 매장 ID",
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "지출 연도",
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "지출 월 (1~12)",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "지출 항목명",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "지출 금액 (₩)",
      },
    },
    {
      freezeTableName: true,
      timestamps: false,

      // ✅ 유니크 인덱스 추가
      indexes: [
        {
          unique: true,
          fields: ["storeId", "year", "month", "name"],
          name: "unique_store_year_month_name",
        },
      ],
    }
  );

  return VariableExpense;
};
