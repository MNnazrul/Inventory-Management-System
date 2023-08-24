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
    let cp = (req.body.details = JSON.parse(receivedSerializedData));
    let arr = req.body.cart_quantity;
    await ser.insertIntoOrders(cp, arr, o_code);
    let total_price = await ser.find_total_price(req.body, cp, arr);

    let curDate = await ser.dateTime();

    await qr.addIntoOrderPlaced(o_code, req.body, curDate, total_price);
    await qr.addIntoOrderPayment(o_code, curDate, req.body.paid);

    let grandTotal = 0;
    for (let i = 0; i < cp.length; i++) {
        cp[i].subtotal = parseFloat(arr[i] * cp[i].p_price).toFixed(2);
        grandTotal =
            grandTotal + parseFloat((arr[i] * cp[i].p_price).toFixed(2));
    }

    console.log(cp);
    console.log(grandTotal);
    const data = {
        o_code,
        customer: req.body.customer,
        payment_address: req.body.product_description,
        time_date: curDate,
        grand_total: grandTotal.toFixed(2),
        discount: req.body.discount,
        total_price,
        paid: req.body.paid,
        due: (total_price - req.body.paid).toFixed(2),
    };

    console.log(data.time_date);
    await qr.clearState();
    return res.redirect(
        `/invoice?cp=${JSON.stringify(cp)}&data=${JSON.stringify(data)}`
    );
};

const invoiceFun = async (req, res) => {
    const receivedSerializedData = req.query.cp;
    const receivedSerializedData1 = req.query.data;
    let cp = JSON.parse(receivedSerializedData);
    let data = JSON.parse(receivedSerializedData1);
    res.render("invoice.ejs", { cp, data });
};

const showOrders = async (req, res) => {
    const rows = await qr.showOrderPlaced();
    res.render("orders.ejs", { rows });
};

const viewInvoince = async (req, res) => {
    const receivedSerializedData = req.query.data;
    let cpp = JSON.parse(receivedSerializedData);

    const rstl1 = await qr.aInfo(cpp.o_code);
    const rstl2 = await qr.pInfo(cpp.o_code);
    const rstl3 = await qr.cInfo(cpp.o_code);

    console.log(rstl1);

    console.log(rstl2);

    console.log(rstl3);
    const data = {
        o_code: cpp.o_code,
        customer: rstl3[0].shop_name,
        payment_address: rstl3[0].shop_address,
        time_date: rstl1[0].date_time,
        grand_total: (
            rstl1[0].total_amount *
            (1 - rstl1[0].discount / 100)
        ).toFixed(2),
        discount: rstl1[0].discount,
        total_price: rstl1[0].total_amount,
        paid: rstl1[0].total_paid,
        due: rstl1[0].total_amount - rstl1[0].total_paid,
    };
    const cp = rstl2;

    // return res.send({ cp, data });

    res.render("view_invoice.ejs", { data, cp });
};

const duePayment = async (req, res) => {
    const receivedSerializedData = req.query.data;
    let cpp = JSON.parse(receivedSerializedData);

    const rstl1 = await qr.aInfo(cpp.o_code);
    const rstl2 = await qr.pInfo(cpp.o_code);
    const rstl3 = await qr.cInfo(cpp.o_code);

    // SUM(b.paid) as total_paid, a.total_amount, a.discount, a.date_time
    // p_name, p_quantity, p_price, (p_quantity * p_price) AS subtotal
    // shop_name, shop_address from customers where shop_name = (select customer from order_placed where o_code = ?)

    const rstl = await qr.paymentInfo(cpp.o_code);
    let t_paid = 0,
        due2 = 0;

    for (let i = 0; i < rstl.length; i++) {
        t_paid = t_paid + parseFloat(rstl[i].paid);
        let due1 = parseFloat(rstl1[0].total_amount - t_paid).toFixed(2);
        rstl[i].due = parseFloat(due1).toFixed(2);
        console.log(t_paid);
        console.log(rstl[i].due);
        due2 = rstl[i].due;
    }

    console.log(rstl);

    let rows = rstl;
    let data = {
        due: due2,
        o_code: cpp.o_code,
        customer: rstl3[0].shop_name,
        cus_address: rstl3[0].shop_address,
        time_date: rstl1[0].date_time,
        total_amount: rstl1[0].total_amount,
    };

    res.render("due_payment.ejs", { rows, data });
};

const newPaid = async (req, res) => {
    const body = req.body;
    let curDate = await ser.dateTime();
    await qr.addIntoOrderPayment(parseInt(body.values), curDate, body.paid);
    res.redirect("/orders");
};

const cntrl = {
    duePayment,
    viewInvoince,
    addNewProduct,
    showP,
    pSearch,
    changeState,
    showCart,
    changeStateFromCart,
    placeOrder,
    invoiceFun,
    showOrders,
    newPaid,
};

module.exports = cntrl;
