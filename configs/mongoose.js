// ----- mongoose -----

var mongoose = require("mongoose");


// ----- mongoose connect -----

mongoose.connect("mongodb://127.0.0.1/crudApi");


// ----- connection -----

var db = mongoose.connection;


// ----- db connection -----

db.once("open", (err) => {
    err ? console.log(err) : console.log("db connected")
})


// ----- export -----

module.exports = db;