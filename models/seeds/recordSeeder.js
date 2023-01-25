//! require mongoose and related modules
const mongoose = require("mongoose");
const userList = require("./userList.json");
const recordList = require("./recordList.json");
const Category = require("../categories");
const User = require("../users");
const Record = require("../records");
const bcrypt = require("bcryptjs");

//! use dotenv in non-production enviorment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.set("strictQuery", true);
//! connect to DB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", async () => {
  try {
    //- 獲取所有category
    const categories = await Category.find({}).lean();
    //- 建立user
    await Promise.all(
      userList.map(async (user, userIndex) => {
        const { name, email, password } = user;
        const hash = bcrypt.hashSync(password, 10);
        const createdUser = await User.create({ name, email, password: hash });
        //- 分配並建立record
        const slicedRecordList = userIndex
          ? recordList.slice(10)
          : recordList.slice(0, 10);
        await Promise.all(
          slicedRecordList.map(async (record) => {
            const { name, date, amount, category } = record;
            //- 取得對應種類相關資訊
            const categoryData = categories.find(
              (cate) => cate.name === category
            );
            await Record.create({
              name,
              date,
              amount,
              userId: createdUser._id,
              categoryId: categoryData._id,
            });
          })
        );
      })
    );
    console.log("recordSeeder done!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
});
