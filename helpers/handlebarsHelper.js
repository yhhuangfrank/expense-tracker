function isSelected(category, lastCategory) {
  return category === lastCategory ? "selected" : "";
}

function paginator(
  category = "all", //- default values for searching
  sort = "amountDesc",
  startDate = "",
  endDate = "",
  currentPage,
  recordsAmount,
  NUM_PER_PAGE
) {
  const totalPages = Math.ceil(recordsAmount / NUM_PER_PAGE);
  let fromPage = currentPage === 1 ? 1 : currentPage - 1;
  let untilPage = fromPage + 4; //- 每次只顯示5頁
  if (untilPage > totalPages) {
    fromPage = totalPages - 4;
    untilPage = totalPages;
  }
  let pagination = "";
  for (let i = fromPage; i <= untilPage; i += 1) {
    if (i <= 0) {
      continue;
    }
    if (currentPage === i) {
      pagination += `
      <li class="page-item"><a class="page-link active" href="/search?category=${category}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&page=${i}">${i}</a></li>
      `;
    } else {
      pagination += `
      <li class="page-item"><a class="page-link" href="/search?category=${category}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&page=${i}">${i}</a></li>
      `;
    }
  }
  return pagination;
}

module.exports = {
  isSelected,
  paginator,
};
