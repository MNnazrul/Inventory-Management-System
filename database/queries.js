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
            MIN(pa.price) AS min_price,
            MAX(pa.price) AS max_price,
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
            MIN(pa.price) AS min_price,
            MAX(pa.price) AS max_price,
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

const qr = {
    selectProducts,
    selectAdmin,
    insertIntoProduct,
    showProducts,
    showSuppliers,
    searchQuery,
    addedProduct,
};

module.exports = qr;
