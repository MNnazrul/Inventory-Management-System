const moment = require("moment");
const qr = require("../database/queries");
const find_total_price = async (body, cp, arr) => {
    let i = 0;
    let total = 0;
    cp.forEach((row) => {
        total = total + arr[i] * row.p_price;
        i = i + 1;
    });
    return (total - (total * body.discount) / 100.0).toFixed(2);
};

const insertIntoOrders = async (cp, arr, o_code) => {
    let i = 0;
    cp.forEach(async (row) => {
        row.p_quantity = arr[i];
        i = i + 1;
        row.o_code = o_code;
        await qr.addIntoOrder(row);
    });
};

const dateTime = async () => {
    const now = new Date();
    const localDatetime = moment(now).format("YYYY-MM-DD h:mm:ss A");
    return localDatetime;
};

const codeGenerator = async () => {
    const randomNumber = parseInt(Math.floor(Math.random() * 10));
    const dateStr = String(Date.now());
    const pref = dateStr.substring(7);
    const o_code = `${pref}${randomNumber}`;
    return o_code;
};

const ser = {
    insertIntoOrders,
    find_total_price,
    dateTime,
    codeGenerator,
};

module.exports = ser;
