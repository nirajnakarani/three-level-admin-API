// ----- express -----

var express = require("express");


// ----- routes -----

var routes = express.Router()


// ----- passport -----

var passport = require("passport")


// ----- user model -----

var registerUser = require("../../../../models/user/registerUser")


// ----- user controller -----

var userController = require("../../../../controllers/API/V1/user/userController");


// ----- login -----

routes.post("/login", userController.login)


// ----- register -----

routes.post("/register", passport.authenticate("manager", { failureRedirect: "/admin/manager/failManagerLogin" }), registerUser.uploadImg, userController.register)


// ----- profile -----

routes.get("/profile", passport.authenticate("user", { failureRedirect: "/admin/manager/user/failUserLogin" }), userController.profile)


// ----- edit profile -----

routes.put("/edit_profile", passport.authenticate("user", { failureRedirect: "/admin/manager/user/failUserLogin" }), registerUser.uploadImg, userController.edit_profile)


// ----- fail manager login -----

routes.get("/failUserLogin", async (req, res) => {
    return res.status(400).json({ msg: "invalid user login", status: 0 })
})


// ----- export -----

module.exports = routes;