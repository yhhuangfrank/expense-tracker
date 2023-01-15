const dayjs = require("dayjs");

module.exports = function dateHelper(arr) {
  arr.forEach((element) => {
    element.date = dayjs(element.date).format("YYYY/MM/DD");
  });
};
