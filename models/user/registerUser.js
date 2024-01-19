// ----- mongoose -----

var mongoose = require("mongoose");


// ----- image path -----

var imgPath = "/uploads/user"


// ----- multer -----

var multer = require("multer")


// ----- path -----

var path = require("path")


// ----- register schema -----

var registerUserSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    userImg: {
        type: String
    },
    managerId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:"managerdata"
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

registerUserSchema.statics.uploadImg = multer({ storage: storage }).single("userImg");


// ----- export admin img path -----

registerUserSchema.statics.imgPath = imgPath;


// ----- register table -----

var register = mongoose.model("userdata", registerUserSchema);


// ----- export -----

module.exports = register;