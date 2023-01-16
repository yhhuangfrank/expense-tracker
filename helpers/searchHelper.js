const dayjs = require("dayjs");

function getCategoryIcon(categoryValue) {
  let icon = "";
  switch (categoryValue) {
    case "home":
      icon = "fa-solid fa-house";
      break;
    case "transport":
      icon = "fa-solid fa-van-shuttle";
      break;
    case "entertainment":
      icon = "fa-solid fa-face-grin-beam";
      break;
    case "food":
      icon = "fa-solid fa-utensils";
      break;
    case "other":
      icon = "fa-solid fa-pen";
      break;
  }
  return icon;
}

function sortHandling(sort) {
  let result = {};
  switch (sort) {
    case "amountDesc":
      result.amount = "desc";
      break;
    case "amountAsc":
      result.amount = "asc";
      break;
    case "dateDesc":
      result.date = "desc";
      break;
    case "dateAsc":
      result.date = "asc";
      break;
  }
  return result;
}

function dateRange(startDate, endDate) {
  let option = {};
  if (startDate && endDate) {
    option.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (startDate && !endDate) {
    option.date = {
      $gte: new Date(startDate),
      $lte: new Date(dayjs().format("YYYY-MM-DD")),
    };
  }
  if (!startDate && endDate) {
    option.date = {
      $lte: new Date(endDate),
    };
  }
  return option;
}

module.exports = {
  getCategoryIcon,
  sortHandling,
  dateRange,
};
