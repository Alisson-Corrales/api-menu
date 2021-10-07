const express = require("express");
const app = express();
const { menu } = require("./data");

app
  .get("/", (req, res) => {
    res.send("<h1> Home </h1>");
    res.end("");
  })
  .listen(3000, () => {
    console.log("server is listening at port 3000...");
  });
