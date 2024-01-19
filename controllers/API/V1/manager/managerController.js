// ----- admin model -----

var registerAdmin = require("../../../../models/admin/registerAdmin")


// ----- manager model -----

var registerManager = require("../../../../models/manager/registerManager")


// ----- user model -----

var registerUser = require("../../../../models/user/registerUser")


// ----- bycrypt -----

var bcrypt = require("bcrypt");


// ----- jwt -----

var jwtData = require("jsonwebtoken")


// ----- path -----

var path = require("path")


// ----- fs -----

var fs = require("fs")


// ----- node mailer -----

var nodemailer = require("nodemailer");


// ----- login -----

module.exports.login = async (req, res) => {
    try {
        var checkEmail = await registerManager.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                var token = jwtData.sign({ userData: checkEmail }, "Manager", { expiresIn: "1h" })
                return res.status(200).json({ msg: "login success", status: 1, token: token })
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
        var checkEmail = await registerManager.findOne({ email: req.body.email })
        if (checkEmail) {
            return res.status(400).json({ msg: "email already exits", status: 0 })
        }
        else {
            if (req.body.password == req.body.confirm_password) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "nakaraniniraj87580@gmail.com",
                        pass: "lagqsepgtzjcshka",
                    },
                });

                const info = await transporter.sendMail({
                    from: 'nakaraniniraj87580@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Manager ✔", // Subject line
                    html: `<b>Email : ${req.body.email}</b><br><b>Password : ${req.body.password}</b>`, // html body
                });

                req.body.adminId = req.user.id;
                req.body.password = await bcrypt.hash(req.body.password, 10)
                req.body.managerImg = registerManager.imgPath + "/" + req.file.filename
                var insert = await registerManager.create(req.body)

                if (insert) {
                    var reg = await registerAdmin.findById(req.user.id);
                    reg.managerId.push(insert.id);
                    await registerAdmin.findByIdAndUpdate(req.user.id, reg)
                    return res.status(400).json({ msg: "manager insert", status: 1 })
                }
                else {
                    return res.status(400).json({ msg: "manager not insert", status: 0 })

                }
            }
            else {
                return res.status(400).json({ msg: "password not match", status: 0 })
            }

        }

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- profile -----

module.exports.profile = async (req, res) => {
    try {
        if (req.user) {
            var userData = await registerManager.findById(req.user.id).populate("userId").exec()
            var profile = await registerManager.findById(req.user.id).populate("adminId").exec()
            return res.status(200).json({ msg: "here is profile", status: 1, profile: profile ,userData:userData.userId , userCounts:userData.userId.length})
        }
        else {
            return res.status(400).json({ msg: "invalid login", status: 0 })

        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- edit profile -----

module.exports.edit_profile = async (req, res) => {
    try {

        var managerData = await registerManager.findById(req.query.id);
        if (managerData) {

            if (req.file) {
                var fullPath = path.join(__dirname, "../../../../", managerData.managerImg);
                await fs.unlinkSync(fullPath)

                req.body.managerImg = registerManager.imgPath + "/" + req.file.filename;

                var update = await registerManager.findByIdAndUpdate(req.query.id, req.body);
                if (update) {
                    return res.status(400).json({ msg: "data update", status: 1 })
                }
                else {
                    return res.status(400).json({ msg: "data not update", status: 0 })

                }

            }
            else {
                req.body.managerImg = managerData.managerImg;
                var update = await registerManager.findByIdAndUpdate(req.query.id, req.body);
                if (update) {
                    return res.status(400).json({ msg: "data update", status: 1 })
                }
                else {
                    return res.status(400).json({ msg: "data not update", status: 0 })

                }
            }
        }
        else {
            return res.status(400).json({ msg: "data not found", status: 0 })
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