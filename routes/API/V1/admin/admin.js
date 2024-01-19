// ----- express -----

var express = require("express");


// ----- routes -----

var routes = express.Router()


// ----- admin model -----

var registerAdmin = require("../../../../models/admin/registerAdmin")


// ----- admin controller -----

var adminController = require("../../../../controllers/API/V1/admin/adminController")


// ----- passport -----

var passport = require("passport")


// ----- login -----

routes.post("/login", adminController.login)


// ----- register -----

routes.post("/register", registerAdmin.uploadImg, adminController.register)


// ----- view admin -----

routes.get("/viewAdmin", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), adminController.viewAdmin)


// ----- profile -----

routes.get("/profile", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), adminController.profile)


// ----- edit profile -----

routes.put("/edit_profile", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), registerAdmin.uploadImg, adminController.edit_profile)


// ----- view manager -----

routes.get("/viewManager", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), adminController.viewManager)


// ----- view user -----

routes.get("/viewUser", passport.authenticate("jwt", { failureRedirect: "/admin/failLogin" }), adminController.viewUser)


// ----- fail login -----

routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ msg: "invalid login", status: 0 })
})


// ----- manager -----

routes.use("/manager", require("../manager/manager"))


// ----- export -----

module.exports = routes;