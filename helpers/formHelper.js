module.exports = {
  checkForm: (data) => {
    const { name, date, amount, category } = data;
    const errMessage = [];
    if (!name || !date || !amount || !category) {
      errMessage.push({ message: "所有欄位皆為必填!" });
    }
    if (amount < 0) {
      errMessage.push({ message: "金額不可小於0" });
    }
    //- 將JS雙精度範圍最大整數(2^53-1)設定為上限
    if (amount > Number.MAX_SAFE_INTEGER) {
      errMessage.push({ message: "輸入金額超過上限!" });
    }
    return errMessage;
  },
};
