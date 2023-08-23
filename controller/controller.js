const qr = require("../database/queries");

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
    addNewProduct,
    showP,
    pSearch,
};

module.exports = cntrl;