const express = require("express");
const cntrl = require("../controller/controller");
const router = express.Router();

router.post("/by", (req, res) => {});

router.get("/dummy", async (req, res) => {
    res.send(`double check`);
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

router.post("/addP", cntrl.addProduct);

module.exports = router;
