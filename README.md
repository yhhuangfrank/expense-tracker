# Expense tracker

A web application for managing your expense

![Previrew](https://github.com/yhhuangfrank/expense-tracker/blob/main/public/images/preview-image1.png)
![Previrew](https://github.com/yhhuangfrank/expense-tracker/blob/main/public/images/preview-image2.png)

## Features

- 本地會員登入、註冊功能
- 第三方(Facebook、Google)會員登入功能
- 本地會員重設密碼功能
- 查看使用者帳號內所有支出紀錄
- 針對支出筆數進行分頁，方便閱讀
- 新增一筆支出
- 編輯支出
- 刪除支出
- 透過選單篩選不同類別、時間區間的支出
- 透過選單依照金額、日期遠近對支出排序

### Installation

1. 開啟終端機，將專案 clone 至本機電腦

```
git clone https://github.com/yhhuangfrank/expense-tracker.git
```

2. 初始化

```
cd expense-tracker // 進入專案資料夾
npm install // 將所需的npm module安裝
```

3. 使用 `npm run seed` 新增種子資料

4. 使用 `npm run start` 執行若出現下方訊息代表順利執行

```
Server is listening to http://localhost:3000
```

4. 網址列輸入 http://localhost:3000/ 開始使用

### Built with

- [Node.js @18.12.1](https://nodejs.org/zh-tw/download/) -Environment
- [Express @4.18.2](https://www.npmjs.com/package/express) - Web framework
- [Express-handlebars @6.0.6](https://www.npmjs.com/package/express-handlebars) - Template engine
- [Bootstrap 5.2](https://getbootstrap.com/)
- [Font-awesome 5.8.1](https://getbootstrap.com/)
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose @6.8.3](https://www.npmjs.com/package/mongoose) - ODM
- And other dependencies
