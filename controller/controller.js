const qr = require("../database/queries");
const ser = require("../service/service");

const addNewProduct = async (req, res) => {
    const randomNumber = parseInt(Math.floor(Math.random() * 10));
    const dateStr = String(Date.now());
    const pref = dateStr.substring(7);
    const pCode = `${pref}${randomNumber}`;
    const body = req.body;
    const formattedDate = new Date().toISOString().split("T")[0];

    body.entry_date = formattedDate;
    body.product_code = pCode;

    try {
        qr.addedProduct(body);
    } catch (err) {
        return res.send("Error occured");
    }

    res.json("working");
};

let items;

const showP = async (req, res) => {
    items = await qr.showProducts();
    const suppliers = await qr.showSuppliers();
    return res.render("new1_dashboard.ejs", { items, suppliers });
};

const changeState = async (req, res) => {
    const receivedSerializedData = req.query.data;
    const body = JSON.parse(receivedSerializedData);
    console.log(body);
    let cp;
    if (parseInt(body.p_state) == 1) cp = await qr.changeState(body.p_name, 0);
    else cp = await qr.changeState(body.p_name, 1);
    return res.redirect("/product");
};

const pSearch = async (req, res) => {
    let query = req.query.q;
    const results = await qr.searchQuery(query);
    res.send(results);
};

const showCart = async (req, res) => {
    const rows = await qr.cartProduct();
    const customers = await qr.showCustomers();
    res.render("tem_cart.ejs", { rows, customers });
};

const changeStateFromCart = async (req, res) => {
    const receivedSerializedData = req.query.data;
    const body = JSON.parse(receivedSerializedData);
    if (parseInt(body.p_state) == 1) cp = await qr.changeState(body.p_name, 0);
    else cp = await qr.changeState(body.p_name, 1);
    res.redirect("/cart");
};

const placeOrder = async (req, res) => {
    const o_code = await ser.codeGenerator();

    const receivedSerializedData = req.body.details;
    const cp = (req.body.details = JSON.parse(receivedSerializedData));
    let arr = req.body.cart_quantity;
    await ser.insertIntoOrders(cp, arr, o_code);
    let total_price = await ser.find_total_price(req.body, cp, arr);

    let curDate = await ser.dateTime();

    await qr.addIntoOrderPlaced(o_code, req.body, curDate, total_price);
    await qr.addIntoOrderPayment(o_code, curDate, req.body.paid);

    console.log(curDate);

    return res.redirect("/invoice");
    res.send(req.body);
};

const cntrl = {
    addNewProduct,
    showP,
    pSearch,
    changeState,
    showCart,
    changeStateFromCart,
    placeOrder,
};

module.exports = cntrl;
