const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.post("/by", (req, res) => {});

app.get("/", (req, res) => {
    res.json({
        message: "runnin ",
    });
});

app.listen(port, () => {
    console.log(`running at port ${port}`);
});
