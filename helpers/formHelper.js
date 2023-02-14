module.exports = {
  checkForm: (data) => {
    const { name, date, amount, category } = data;
    const errMessage = [];
    if (!name || !date || !category) {
      errMessage.push({ message: "所有欄位皆為必填!" });
    }
    if (amount < 0) {
      errMessage.push({ message: "金額不可小於0" });
    }
    if (/\<script\>/.test(name)) {
      errMessage.push({ message: "名稱格式有誤!" });
    }
    //- 將JS最大整數設定為上限
    if (amount > Number.MAX_VALUE || amount === "") {
      errMessage.push({ message: "輸入金額超過上限或為空!" });
    }
    return errMessage;
  },
};
