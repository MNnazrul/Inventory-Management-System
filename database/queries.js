const pool = require("./db");

const selectProducts = async () => {
    const result = await pool.query(`select * from products`);
    return result[0];
};

const selectAdmin = async () => {
    const result = await pool.query(`select * from admin where user_id = 1`);
    return result[0];
};

const insertIntoProduct = async (body) => {
    const result = await pool.query(`insert into products values(?,?,?,?)`, [
        body.product_name,
        body.product_code,
        body.product_category,
        body.product_description,
    ]);
};

const showProducts = async (body) => {
    const result = await pool.query(
        `
            SELECT
                p.p_name,
                p.p_code,
                p.p_category,
                p.p_des,
                p.p_price,
                p.p_state,
                SUM(pa.amount) AS total_amount
            FROM
                products p
            JOIN
                product_added pa ON p.p_code = pa.p_code
            GROUP BY
                p.p_name, p.p_code;
        `
    );
    return result[0];
};

const searchQuery = async (query) => {
    const result = await pool.query(
        `
        SELECT
            p.p_name,
            p.p_code,
            p.p_category,
            p.p_des,
            p.p_price,
            p.p_state,
            SUM(pa.amount) AS total_amount
        FROM
            products p
        JOIN
            product_added pa ON p.p_code = pa.p_code
        WHERE
            p.p_name LIKE '%${query}%'
            OR p.p_des LIKE '%${query}%'
            OR p.p_category LIKE '%${query}%'
        GROUP BY
            p.p_name, p.p_code;
        `
    );
    return result[0];
};

const showSuppliers = async () => {
    const result = await pool.query(`select * from suppliers`);
    return result[0];
};

const addedProduct = async (body) => {
    await pool.query(
        `INSERT INTO product_added (p_code, price, amount, entry_date, mf_date, exp_date, supplier)
        VALUES (?,?,?,?,?,?,?)
        `,
        [
            body.product_code,
            body.price,
            body.product_code,
            body.entry_date,
            body.mf_date,
            body.exp_date,
            body.supplier,
        ]
    );
};

const changeState = async (p_name, state) => {
    const result = await pool.query(
        `update products set p_state = ? where p_name = ?`,
        [state, p_name]
    );
    return result;
};

const cartProduct = async () => {
    const result = await pool.query(
        `
        SELECT
            p.p_name,
            p.p_code,
            p.p_category,
            p.p_des,
            p.p_price,
            p.p_state,
            SUM(pa.amount) AS total_amount
        FROM
            products p
        JOIN
            product_added pa ON p.p_code = pa.p_code
        WHERE
            p.p_state = 1
        GROUP BY
            p.p_name, p.p_code;

        `
    );
    return result[0];
};

const showCustomers = async () => {
    const result = await pool.query(`select * from customers`);
    return result[0];
};

const addIntoOrder = async (body) => {
    await pool.query(
        `insert into orders (o_code, p_name, p_quantity, p_price) values(?, ?, ?, ?)`,
        [body.o_code, body.p_name, body.p_quantity, body.p_price]
    );
};

const addIntoOrderPlaced = async (code, body, date_time, t_amount) => {
    await pool.query(
        `insert into order_placed (o_code, customer, date_time, total_amount, discount) values(?, ?, ?, ?, ?)`,
        [code, body.customer, date_time, t_amount, body.discount]
    );
};

const addIntoOrderPayment = async (code, date_time, paid) => {
    await pool.query(
        `insert into order_payment (o_code, payment_date, paid) values(?, ?, ?)`,
        [code, date_time, paid]
    );
};

const showOrderPlaced = async () => {
    const result = await pool.query(
        `select * from order_placed order by o_code desc`
    );
    return result[0];
};

const clearState = async () => {
    await pool.query(
        `update products set p_state = ? where p_state = ?`,
        [0, 1]
    );
};

const aInfo = async (o_code) => {
    const result = await pool.query(
        `SELECT SUM(b.paid) as total_paid, a.total_amount, a.discount, a.date_time
        FROM order_placed AS a
        JOIN order_payment AS b ON a.o_code = b.o_code
        WHERE a.o_code = ?;
        `,
        [o_code]
    );
    return result[0];
};

const pInfo = async (o_code) => {
    const result = await pool.query(
        `SELECT p_name, p_quantity, p_price, (p_quantity * p_price) AS subtotal
        FROM orders
        WHERE o_code = ?
        `,
        [o_code]
    );
    return result[0];
};

const cInfo = async (o_code) => {
    const result = await pool.query(
        `select shop_name, shop_address from customers where shop_name = (select customer from order_placed where o_code = ?)`,
        [o_code]
    );
    return result[0];
};

const paymentInfo = async (o_code) => {
    const result = await pool.query(
        `select * from order_payment where o_code = ?`,
        [o_code]
    );
    return result[0];
};

const qr = {
    paymentInfo,
    selectProducts,
    selectAdmin,
    insertIntoProduct,
    showProducts,
    showSuppliers,
    searchQuery,
    addedProduct,
    changeState,
    cartProduct,
    showCustomers,
    addIntoOrder,
    addIntoOrderPlaced,
    addIntoOrderPayment,
    showOrderPlaced,
    clearState,
    aInfo,
    pInfo,
    cInfo,
};

module.exports = qr;
