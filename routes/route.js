const express = require("express");
const cntrl = require("../controller/controller");
const router = express.Router();
const qr = require("../database/queries");

router.post("/by", (req, res) => {});

router.get("/dummy", async (req, res) => {
    const query = "product ";
    const result = await qr.searchQuery(query);
    res.send(result);
});

router.get("/", (req, res) => {
    res.render("login.ejs");
});

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs");
});

router.get("/product", cntrl.showP);

router.post("/addNewProduct", cntrl.addNewProduct);

router.post("/addEP", async (req, res) => {
    res.send(req.body);
});

router.get("/cart", (req, res) => {
    res.render("cart.ejs");
});

router.get("/invoice", (req, res) => {
    res.render("invoice.ejs");
});

router.get("/users", (req, res) => {
    res.render("users.ejs");
});

router.get("/tem_dash", (req, res) => {
    res.render("tem_dash.ejs");
});

router.get("/search", cntrl.pSearch);

router.post("/addP", async (req, res) => {});

module.exports = router;
