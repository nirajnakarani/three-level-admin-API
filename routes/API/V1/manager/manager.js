// ----- express -----

var express = require("express");


// ----- routes -----

var routes = express.Router()


// ----- passport -----

var passport = require("passport")


// ----- manager model -----

var registerManager = require("../../../../models/manager/registerManager")


// ----- manager controller -----

var managerController = require("../../../../controllers/API/V1/manager/managerController")


// ----- login -----

routes.post("/login", managerController.login)


// ----- register -----

routes.post("/register", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), registerManager.uploadImg, managerController.register)


// ----- profile -----

routes.get("/profile", passport.authenticate("manager", { failureRedirect: "/admin/manager/failManagerLogin" }), managerController.profile)


// ----- edit profile -----

routes.put("/edit_profile", passport.authenticate("manager", { failureRedirect: "/admin/manager/failManagerLogin" }), registerManager.uploadImg, managerController.edit_profile)


// ----- view user -----

routes.get("/viewUser", passport.authenticate("manager", { failureRedirect: "/admin/manager/failManagerLogin" }), managerController.viewUser)


// ----- fail manager login -----

routes.get("/failManagerLogin", async (req, res) => {
    return res.status(400).json({ msg: "invalid manager login", status: 0 })
})


// ----- user -----

routes.use("/user", require("../user/user"))


// ----- export -----

module.exports = routes;