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
    return errMessage;
  },
};
