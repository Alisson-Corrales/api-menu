const { Console } = require("console");
const { privateDecrypt } = require("crypto");
const express = require("express");
const app = express();
const { products } = require("./data");

app
  .get("/", (req, res) => {
    //dish.filteer();
    res.send('<h1>Home Page</h1> <a href="/api/products">Products</a>');
  })
  .get("/api/products", (req, res) => {
    const newProducts = products.map((products) => {
      const { name, id, image } = products;
      return { id, name, image };
    });
    //this adds onto the json
    res.json({ results: newProducts, success: true });
  })
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //search using params
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  .get("/api/products/:id", (req, res) => {
    //console.log(req.params);
    const { id } = req.params;
    //two equals converts things into strings
    //but Number() converts it into a number instead of a string
    const singleProduct = products.find((product) => product.id === Number(id));
    if (!singleProduct) {
      return res
        .status(404)
        .json({ results: [], success: false, message: "No Matching ID found" });
      //.json({ results: [], status: 404, message: "No Matching ID found" })
      //{} is object
      //[] is array
      //looking for data, leave empty array if failed
    }
    res.json({ results: [singleProduct], success: true });
  })
  //type in price and return anything lower than abscribed price
  .get("/api/pricing/:price", (req, res) => {
    const { price } = req.params;
    const productPrice = products.filter((product) => {
      return product.price < Number(price);
      //only return price if it's less than the price from params
    });
    if (!productPrice) {
      return res.status(404).json({
        results: [],
        success: false,
        message: "Don't be a cheapstake man, nothing's that cheap",
      });
    }
    res.json({ results: productPrice, success: true });
  })

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //search with query
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  .get("/api/v1/query", (req, res) => {
    //console.log(req.query);
    //res.send("test");
    const { search, limit } = req.query;
    //create a immutable(meaning you cannot mutate) copy of data
    // let newProducts = products <== muttable and BAD
    // let newProducts = products.map((products) => product) <== stil mutable :C
    let assortedProducts = [...products]; // <== immutable GOOD
    if (search) {
        assortedProducts = assortedProducts.filter((product) => {
        return product.name.includes(search);
      });
    }
    if (limit) {
      assortedProducts = assortedProducts.slice(0, Number(limit));
    }
    if (assortedProducts.length < 1) {
      return res.json({
        results: [],
        success: false,
        message: "No products match search parameters",
      });
    }
    res.json({ results: assortedProducts, success: true });
  })

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  .all("*", (req, res) => {
    res.status(404).send("<h1>sorry! not found</h1>");
  })
  .listen(3000, () => {
    console.log("server is listening at port 3000...");
  });
