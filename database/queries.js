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
        `INSERT INTO product_added (p_code, price, amount, i_amount, entry_date, mf_date, exp_date, supplier)
        VALUES (?,?,?,?,?,?,?,?)
        `,
        [
            body.product_code,
            body.price,
            body.amount,
            body.amount,
            body.entry_date,
            body.mf_date,
            body.exp_date,
            body.supplier,
        ]
    );
};

const updateProductAmount = async (body) => {
    await pool.query(
        `update products set total_amount = total_amount + ?, p_price = ? where p_code = ?`,
        [body.amount, body.price, body.product_code]
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

const addDamage = async (body, date_time) => {
    await pool.query(
        `insert into damage (p_name, p_price, amount, des, date_time) values (?, ?, ?, ?, ?)`,
        [
            body.product_name,
            body.product_price,
            body.dam_amount,
            body.dam_description,
            date_time,
        ]
    );
};

const damageProduct = async () => {
    const result = await pool.query(
        `select p_name, p_price, amount, des, date_time, (p_price * amount) as total_cost from damage order by date_time desc`
    );
    return result[0];
};

const expenses = async () => {
    const result = await pool.query(`select * from expenses`);

    return result[0];
};

// select customer, sum(paid) as t_paid from order_placed, order_payment group by customer order by t_paid desc;
// select p_name, sum(paid) as t_paid from orders, order_payment group by p_name order by t_paid desc;

const mostCustomer = async () => {
    const result = await pool.query(
        `select customer, sum(paid) as t_paid from order_placed, order_payment group by customer order by t_paid desc`
    );
    return result[0];
};

const mostProduct = async () => {
    const result = await pool.query(
        `select p_name, sum(paid) as t_paid from orders, order_payment group by p_name order by t_paid desc`
    );
    return result[0];
};

const transactions = async () => {
    const result = await pool.query(
        `
            SELECT 'supplied' AS source_table, supplier, entry_date AS date_time, (price * amount) AS total_amount
            FROM product_added
            UNION
            SELECT 'sold' AS source_table, customer, date_time, total_amount 
            FROM order_placed
            ORDER BY date_time DESC
        `
    );
    return result[0];
};

const productAddedByCode = async (p_code) => {
    const result = await pool.query(
        `select * from product_added where p_code = ?`,
        [p_code]
    );
    return result[0];
};

const quanMinusByEntrDate = async (entry_date, up) => {
    await pool.query(
        `update product_added set amount = amount - ? where entry_date = ?`,
        [up, entry_date]
    );
};

const updateProducts = async (p_code, am) => {
    await pool.query(
        `update products set total_amount = total_amount - ? where p_code = ?`,
        [am, p_code]
    );
};

const minusFromExDam = async (dam_minus) => {
    await pool.query(`update expenses set total_dam_exp = total_dam_exp + ?`, [
        dam_minus,
    ]);
};

const addIntoProducts = async (body) => {
    await pool.query(
        `insert into products (p_name, p_code, p_category, p_des, p_price, total_amount, p_state) values (?,?,?,?,?,?,?) `,
        [
            body.product_name,
            body.product_code,
            body.product_category,
            body.product_description,
            body.price,
            body.amount,
            0,
        ]
    );
};

const manageSupplyExpenses = async (t_price) => {
    await pool.query(
        `update expenses set total_balance = total_balance - ?, total_supply = total_supply + ?`,
        [t_price, t_price]
    );
};

const manageSalesExpenses = async (t_price, t_due) => {
    await pool.query(
        `update expenses set total_balance = total_balance + ?, total_sales = total_sales + ?, total_due = total_due + ?`,
        [t_price, t_price, t_due]
    );
};

const manageDueExpenses = async (paid) => {
    await pool.query(
        `update expenses set total_balance = total_balance + ?, total_sales = total_sales + ?, total_due = total_due - ?`,
        [paid, paid, paid]
    );
};

const productHistory = async () => {
    const result = await pool.query(
        `
        select p_name, a.p_code, entry_date, mf_date, exp_date, supplier, price, amount, (price*amount) as total, p_category 
        from products as a, product_added as b 
        where a.p_code = b.p_code;
        `
    );
    return result[0];
};

const qr = {
    productHistory,
    manageDueExpenses,
    manageSalesExpenses,
    manageSupplyExpenses,
    addIntoProducts,
    minusFromExDam,
    updateProducts,
    quanMinusByEntrDate,
    productAddedByCode,
    transactions,
    addDamage,
    mostProduct,
    mostCustomer,
    expenses,
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
    damageProduct,
    updateProductAmount,
};

module.exports = qr;
