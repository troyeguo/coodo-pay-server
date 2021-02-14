"use strict";
const path = require("path");
require("dotenv").config();

module.exports = {
  port: 3001,
  secret: "coodo-pay",
  smms: "ioTLRUHum8ky6YrVqTb3QY6yxITYcdT0",
  connection: process.env.REMOTE_PROD_DB,
  mongoDB: {
    database: "coodo",
    username: "root",
    password: "root",
    host: "127.0.0.1",
    port: 27017,
  },
};
