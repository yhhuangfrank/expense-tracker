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
  const CRITICAL_PAGES = 7;
  //- 當總頁數為7頁以上，過濾多餘頁數及新增第一頁連結
  if (totalPages >= CRITICAL_PAGES) {
    //- 目前頁面超過第二頁，顯示第一頁連結
    if (currentPage > 2) {
      pagination += `
    <li class="page-item"><a class="page-link" href="/search?category=${category}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&page=1">1</a></li>
    `;
    }
    //- 過濾中間頁
    if (currentPage > 3) {
      pagination += `
    <li class="page-item disabled"><a class="page-link">...</a></li>
    `;
    }
  }

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

  //- 當總頁數為7頁以上，過濾多餘頁數及新增最後頁連結
  if (totalPages >= CRITICAL_PAGES) {
    //- 過濾中間頁
    if (untilPage < totalPages - 1) {
      pagination += `
      <li class="page-item disabled"><a class="page-link">...</a></li>
      `;
    }
    if (untilPage < totalPages) {
      pagination += `
      <li class="page-item"><a class="page-link" href="/search?category=${category}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&page=${totalPages}">${totalPages}</a></li>
      `;
    }
  }
  return pagination;
}

module.exports = {
  isSelected,
  paginator,
};
