const express = require("express");
const app = express();
require("dotenv").config();
const axios = require('axios');
require('./runner')
//Routes
app.use('/healthcheck', require('./healthchecker'));
const PORT = process.env.PORT || 4002;
app.listen(PORT, console.log("Server has started at port " + PORT));
 