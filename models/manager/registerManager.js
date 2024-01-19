// ----- mongoose -----

var mongoose = require("mongoose");


// ----- image path -----

var imgPath = "/uploads/manager"


// ----- multer -----

var multer = require("multer")


// ----- path -----

var path = require("path")


// ----- register schema -----

var registerManagerSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    managerImg: {
        type: String
    },
    adminId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "admindata"
    },
    userId:{
        type:Array,
        ref:"userdata"
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

registerManagerSchema.statics.uploadImg = multer({ storage: storage }).single("managerImg");


// ----- export admin img path -----

registerManagerSchema.statics.imgPath = imgPath;


// ----- register table -----

var register = mongoose.model("managerdata", registerManagerSchema);


// ----- export -----

module.exports = register;