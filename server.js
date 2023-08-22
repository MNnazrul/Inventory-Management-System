const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./routes/route");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("assets"));

app.use("/", router);

app.listen(port, () => {
    console.log(`running at port ${port}`);
});
