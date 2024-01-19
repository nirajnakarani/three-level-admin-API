// ----- query string -----

// var queryString = require("query-string")


// ----- bcrypt -----

var bcrypt = require("bcrypt")


// ----- json web token -----

var jwtData = require("jsonwebtoken")


// ----- fs -----

var fs = require("fs")


// ----- path -----

var path = require("path")


// ----- register admin model -----

var registerAdmin = require("../../../../models/admin/registerAdmin")


// ----- register manager model -----

var registerManager = require("../../../../models/manager/registerManager")


// ----- register user model -----

var registerUser = require("../../../../models/user/registerUser")


// ----- login -----

module.exports.login = async (req, res) => {
    try {

        var checkEmail = await registerAdmin.findOne({ email: req.body.email })
        if (checkEmail) {

            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                var token = jwtData.sign({ userData: checkEmail }, "Admin", { expiresIn: "1h" })
                return res.status(200).json({ msg: "Login Success", status: 1, token: token })

            }
            else {

                return res.status(400).json({ msg: "invalid password", status: 0 })
            }

        }
        else {
            return res.status(400).json({ msg: "invalid email", status: 0 })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }

}


// ----- register -----

module.exports.register = async (req, res) => {
    try {
        
        // req.body = Object.fromEntries(new URLSearchParams(req.body.registerData))
        // console.log(req.body)
        // console.log(req.file)
        var checkEmail = await registerAdmin.findOne({ email: req.body.email });

        if (checkEmail) {
            return res.status(200).json({ msg: "Email already exits", status: 1 })
        }
        else {

            if (req.body.password == req.body.confirm_pass) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                req.body.adminImg = registerAdmin.imgPath + "/" + req.file.filename;
                
                var insert = await registerAdmin.create(req.body);

                if (insert) {
                    return res.status(200).json({ msg: "Data insert", status: 1, "user": insert })
                }
                else {
                    return res.status(400).json({ msg: "Data not insert", status: 0 })

                }

            }
            else {
                return res.status(200).json({ msg: "Password not match", status: 0 })

            }

        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- view admin -----

module.exports.viewAdmin = async (req, res) => {
    try {

        var adminData = await registerAdmin.find({});
        if (adminData) {
            return res.status(200).json({ msg: "here are admin", status: 1, data: adminData })
        }
        else {

            return res.status(400).json({ msg: "data not found", status: 0 })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- view manager -----

module.exports.viewManager = async (req, res) => {

    try {

        var managerData = await registerManager.find({});
        if (managerData) {
            return res.status(200).json({ msg: "here are mangers", status: 1, managerData: managerData })
        }
        else {
            return res.status(400).json({ msg: "manager not found", status: 0 })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }

}


// ----- view user -----

module.exports.viewUser = async (req, res) => {

    try {
        var userData = await registerUser.find({});
        if (userData) {
            return res.status(200).json({ msg: "here are user", status: 1, userData: userData })
        }
        else {
            return res.status(400).json({ msg: "data not found", status: 0 })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- profile -----

module.exports.profile = async (req, res) => {
    try {
        var profile = await registerAdmin.findById(req.user.id).populate("managerId").exec();
        return res.status(200).json({ msg: "here profile", status: 1, profile: profile, managersCount: profile.managerId.length })

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- edit profile -----

module.exports.edit_profile = async (req, res) => {
    try {
        var adminData = await registerAdmin.findById(req.query.id);
        if (adminData) {
            if (req.file) {
                var fullPath = path.join(__dirname, "../../../../", adminData.adminImg);
                await fs.unlinkSync(fullPath);

                req.body.adminImg = registerAdmin.imgPath + "/" + req.file.filename;
                var update_admin = await registerAdmin.findByIdAndUpdate(req.query.id, req.body);
                if (update_admin) {

                    return res.status(200).json({ msg: "admin update", status: 1 })
                }
                else {

                    return res.status(400).json({ msg: "admin not update", status: 0 })
                }
            }
            else {

                req.body.adminImg = adminData.adminImg;
                var update_admin = await registerAdmin.findByIdAndUpdate(req.query.id, req.body);
                if (update_admin) {

                    return res.status(200).json({ msg: "admin update", status: 1 })
                }
                else {

                    return res.status(400).json({ msg: "admin not update", status: 0 })
                }
            }
        }
        else {
            return res.status(400).json({ msg: "admin data not found", status: 0 })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ msg: err, status: 0 })
    }

}