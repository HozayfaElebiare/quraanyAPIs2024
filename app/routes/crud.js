
var express = require("express");
var app = express();

var crud = require("../controllers/crud/crud").crud;

var routerArr = [

    "Blog",
    "BlogCat",
    "Hadith",
    "NL",
    "pkg",
    "profiles",
    "Quraan",
    "Schedule",
    "Session",
    "sub",
    "User",
    "Verse",
    "profiles/admin",
    "profiles/coordinator",
    "profiles/publisher",
    "profiles/tutor",
    "profiles/student",
];

routerArr.forEach(function(crudName, index) {
    console.log(index + 1, crudName);
    app.use(
        "/" + crudName + "/",
        crud("../../models/" + crudName + ".Model", " " + crudName)
    );
});

module.exports = app;
