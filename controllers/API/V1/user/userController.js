// ----- manager model -----

var registerManager = require("../../../../models/manager/registerManager")


// ----- user model -----

var registerUser = require("../../../../models/user/registerUser")


// ----- bcrypt -----

var bcrypt = require("bcrypt")


// ----- jwt -----

var jwtData = require("jsonwebtoken")


// ----- path -----

var path = require("path")


// ----- fs -----

var fs = require("fs")


// ----- login -----

module.exports.login = async (req, res) => {
    try {
        var checkEmail = await registerUser.findOne({ email: req.body.email })
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                var token = jwtData.sign({ userData: checkEmail }, "User", { expiresIn: "1h" })
                return res.status(200).json({ msg: "login success", status: 1, token: token })
            }
            else {
                return res.status(400).json({ msg: "invlid password", status: 0 })
            }
        }
        else {
            return res.status(400).json({ msg: "invlid email", status: 0 })
        }

    }
    catch (err) {
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- register -----

module.exports.register = async (req, res) => {
    try {

        var checkEmail = await registerUser.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ msg: "email already exits", status: 0 })
        }
        else {
            if (req.body.password == req.body.confirm_password) {
                req.body.userImg = registerUser.imgPath + "/" + req.file.filename;
                req.body.password = await bcrypt.hash(req.body.password, 10)
                req.body.managerId = req.user.id;

                var insert = await registerUser.create(req.body);
                if (insert) {
                    var man = await registerManager.findById(req.user.id);
                    man.userId.push(insert.id);
                    await registerManager.findByIdAndUpdate(req.user.id, man)
                    return res.status(200).json({ msg: "user insert", status: 1 })

                }
                else {
                    return res.status(400).json({ msg: "user not insert", status: 0 })

                }

            }
            else {
                return res.status(400).json({ msg: "password not match", status: 0 })
            }
        }

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ msg: err, status: 0 })
    }
}


// ----- profile -----

module.exports.profile = async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({ msg: "here is profile", status: 1, profile: req.user })
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

        var userData = await registerUser.findById(req.query.id);
        if (userData) {

            if (req.file) {
                var fullPath = path.join(__dirname, "../../../../", userData.userImg);
                await fs.unlinkSync(fullPath)

                req.body.userImg = registerUser.imgPath + "/" + req.file.filename;
                var update = await registerUser.findByIdAndUpdate(req.query.id, req.body);
                if (update) {
                    return res.status(400).json({ msg: "data update", status: 1 })
                }
                else {
                    return res.status(400).json({ msg: "data not update", status: 0 })

                }

            }
            else {
                req.body.userImg = userData.userImg;
                var update = await registerUser.findByIdAndUpdate(req.query.id, req.body);
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

