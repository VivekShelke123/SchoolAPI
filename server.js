"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var port = process.env.PORT || 5000;
app_1.app.listen(port, function () {
    console.log("Server on Port=".concat(port, " Started Successfully"));
});
