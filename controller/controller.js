const qr = require("../database/queries");

const addProduct = async (req, res) => {
    const rslt1 = await qr.selectProducts();
    rslt1.pro_code = "v";
    console.log(rslt1);
    console.log(rslt1.length);
    const rslt2 = await qr.selectAdmin();
    console.log(rslt2);
    res.send("test");
};

const showP = async (req, res) => {
    const items = await qr.showProducts();
    const suppliers = await qr.showSuppliers();
    return res.render("new1_dashboard.ejs", { items, suppliers });
};

const pSearch = async (req, res) => {
    let query = req.query.q;
    const results = await qr.searchQuery(query);
    res.send(results);
};

const cntrl = {
    addProduct,
    showP,
    pSearch,
};

module.exports = cntrl;
