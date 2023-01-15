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

module.exports = {
  getCategoryIcon,
};
