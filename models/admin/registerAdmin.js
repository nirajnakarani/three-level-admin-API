// ----- mongoose -----

var mongoose = require("mongoose");


// ----- image path -----

var imgPath = "/uploads/admin"


// ----- multer -----

var multer = require("multer")


// ----- path -----

var path = require("path")


// ----- register schema -----

var registerAdminSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    adminImg: {
        type: String
    },
    managerId: {
        type: Array,
        ref: "managerdata"
    }
})


// ----- img -----

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../..", imgPath))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now())
    }
})


// ----- single img -----

registerAdminSchema.statics.uploadImg = multer({ storage: storage }).single("adminImg");


// ----- export admin img path -----

registerAdminSchema.statics.imgPath = imgPath;


// ----- register table -----

var register = mongoose.model("admindata", registerAdminSchema);


// ----- export -----

module.exports = register;