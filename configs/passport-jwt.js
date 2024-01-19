// ----- passport -----

var passport = require("passport");


// ----- jwt stratagy -----

var jwtStrategy = require("passport-jwt").Strategy;


// ----- jwt extract -----

var jwtExtract = require("passport-jwt").ExtractJwt;


// ----- register admin model -----

var registerAdmin = require("../models/admin/registerAdmin")


// ----- register manager model -----

var registerManager = require("../models/manager/registerManager")


// ----- register user model -----

var registerUser = require("../models/user/registerUser")


// ----- option -----

// admin 

var opts_admin = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Admin"
}


// manager 

var opts_manager = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Manager"
}


// user 

var opts_user = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "User"
}


// ----- find admin data -----

passport.use(new jwtStrategy(opts_admin, async (record, done) => {
    var checkAdmin = await registerAdmin.findById(record.userData._id)
    if (checkAdmin) {
        return done(null, checkAdmin)
    }
    else {
        return done(null, false)
    }
}))


// ----- find manager data -----

passport.use("manager", new jwtStrategy(opts_manager, async (record, done) => {

    var checkManager = await registerManager.findById(record.userData._id)
    if (checkManager) {
        return done(null, checkManager)
    }
    else {
        return done(null, false)
    }
}))


// ----- find user data -----

passport.use("user", new jwtStrategy(opts_user, async (record, done) => {

    var checkUser = await registerUser.findById(record.userData._id)
    if (checkUser) {
        return done(null, checkUser)
    }
    else {
        return done(null, false)
    }
}))


// ----- serializeUser -----

passport.serializeUser(async (user, done) => {

    return done(null, user.id)

})


// ----- deserializeUser -----

passport.deserializeUser(async (id, done) => {

    var adminData = await registerAdmin.findById(id);
    if (adminData) {
        return done(null, adminData)
    }
    else {
        return done(null, false)
    }

})

// ----- export -----

module.exports = passport