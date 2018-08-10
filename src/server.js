import express from "express";
import path from "path";
const app = express();
require("dotenv").config();

export default function StartServer() {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./index.html"));
  });

  app.listen(process.env.PORT, err => {
    if (err) console.error(err);
    console.log("listening on port " + process.env.PORT);
  });
}
