const express = require('express');
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
require('./models/index');
const router = require('./router/index');

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use("/", router);
app.listen(PORT, (() => console.log("server is connected on " + PORT)));  
