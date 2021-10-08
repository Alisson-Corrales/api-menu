const express = require("express");
const app = express();
const { menu } = require("./data");

app
  .get("/", (req, res) => {
    const menuItems = menu.map((item) => {
      const { title, price, img, category, desc, id } = item;
      return { title, img, price, category, desc, id };
    });
    res.send(menuItems);
  })
  
  //🥞~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~🥞

  // 🥞 search by id with params 🥞
  .get("/menu/:id", (req, res) => {
    const { id } = req.params;
    const singleItem = menu.find((menuItem) => menuItem.id === Number(id));
    if (!singleItem) {
      console.log(singleItem);
      return res
        .status(404)
        .json({
          results: [],
          success: false,
          message: "nothing has that ID! D:",
        });
    }
    res.json({ results: [singleItem], success: true });
  })
  
  //🥞 look at menu based on the category 🥞
  .get("/menu/v1/search?category=", (req, res) => {
    const { search } = req.query;
    let itemsByCategory = [...menu];
    //array of unique categories
    const categories = [...new Set(menu.map(item => item.category))]

    if (search) {
      itemsByCategory = itemsByCategory.filter((item) => {
        return item.category.includes(search);
      });
    }
    {/*const { search, limit } = req.query;
    let itemsByCategory = [...menu];

    if (search) {
      itemsByCategory = itemsByCategory.filter((item) => {
        return item.category.includes(search);
      });
    }
    if (limit) {
      itemsByCategory = itemsByCategory.slice(0, Number(limit));
    }
    //error
    if (itemsByCategory > 1) {
      return res.json({
        results: [],
        success: false,
        message: "nothing matches that search paramter ):",
      });
    }
  res.json({results: [itemsByCategory], success: true})*/}
    res.json({results: [itemsByCategory], success: true})
  })
  
  //🥞~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~🥞
  
  .all("*", (req, res) => {
    res.status(404).send("sorry! not found ):");
  })
  .listen(3000, () => {
    console.log("server is listening at port 3000...");
  });
