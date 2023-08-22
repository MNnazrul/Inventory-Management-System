const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('assets'));

app.post("/by", (req, res) => {});

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.get("/orders", (req, res) => {
    res.render("orders.ejs");
});

app.get("/supplier", (req, res) => {
    res.render("supplier.ejs");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs");
});

app.get("/new_dashboard", (req, res) => {
    res.render("new_dashboard.ejs");
});

app.get("/product", (req, res) => {
    res.render("product.ejs");
});

app.get("/cart", (req, res) => {
    res.render("cart.ejs");
});

app.get("/invoice", (req, res) => {
    res.render("invoice.ejs");
});

app.get("/users", (req, res) => {
    res.render("users.ejs");
});

app.get("/tem_dash", (req, res) => {
    res.render("tem_dash.ejs");
});

app.listen(port, () => {
    console.log(`running at port ${port}`);
});
