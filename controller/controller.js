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
    return res.render("new_dashboard.ejs", { items });
};

const cntrl = {
    addProduct,
    showP,
};

module.exports = cntrl;
