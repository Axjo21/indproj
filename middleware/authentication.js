/**
 * General middleware.
 */
"use strict";
// SETUP
const config = require("../config/db/pulse.json");
const functions = require("../src/functions.js");

// RETRIEVE DEPENDENCIES
const mysql  = require("promise-mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("../route/pulse");
require('dotenv').config();

// SETUP CONNECTION TO DB
let db;
(async function() {
    db = await mysql.createConnection(config);
    process.on("exit", () => {
        db.end();
    });
})();

// LOGIN AUTHENTICATION
async function authenticateLogin(req, res, next) {
    // RETRIEVE INPUT DATA
    const username = req.body.username;
    const password = req.body.password;
    let sql;
    let result;
    console.log(username);
    console.log(password);
    sql = `CALL authenticate_login(?);`;

    try {
        // TRY TO LOGIN CORRECTLY
        // DOES USER EXIST? 
        result = await db.query(sql, [username]);
        if (result === isNaN){
            console.log("WRONG USER");
            throw new Error
        }

        // COMPARE PASSWORD TO ENCRYPTED PASSWORD IN DB
        let db_password = result[0][0].password;
        let hash = await bcrypt.hash(password, 10);
        const comparison = await bcrypt.compare(password, db_password);

        // ECHO INFORMATION
        console.log(hash);
        console.log(db_password);
        console.log(password);
        console.log("is right password? ", comparison);

        // IF PASSWORD IS WRONG, REDIRECT TO LOGIN
        if (comparison == false) {
            console.log("wrong password");
            return res.render("pulse/login", {title: "Project Pulse", error: "Wrong password"});
        }

        // USER EXISTS AND PASSWORD IS CORRECT -> PROCEED
        //CREATE TOKEN
        const secretKey = "secret";
        const token = jwt.sign({
                user: `${username}`
            },
            process.env.ACCESS_TOKEN_SECRET,
            { 
                expiresIn: "1h"
            });
        console.log("middleware token:" + token);
        console.log("SETTING COOKIE");

        // GET USERS AUTHORITY FROM DATABASE
        let userAuthority;
        userAuthority = await functions.getUserRole(username);
        console.log("AUTH RESULT FROM DB:   " + userAuthority);

        // REDIRECT TO PROPER WELCOME PAGE BASED ON USER AUTHORITY
        if (userAuthority == 'member') {
            res.cookie('tokenCookie', { token }, { path: "/member" }, { domain: "localhost:1337"});
            res.cookie('userAuth', { userAuthority });
            res.cookie('loggedUser', { username });
            return res.redirect('/member');
        } else if (userAuthority == 'manager') {
            res.cookie('tokenCookie', { token }, { path: "/manager" }, { domain: "localhost:1337"});
            res.cookie('userAuth', { userAuthority });
            res.cookie('loggedUser', { username });
            return res.redirect('/manager');
        }
    } catch(error) {
        // CATCH ERROR , SINCE LOGIN UNSUCCESSFUL
        return res.render("login", {title: "Project Pulse", error: "Wrong password"});
    }
    next();
}

// CHECK TOKEN ON EVERY ROUTE
// EXISTS = OK ? => PROCEED , ELSE => GO BACK
function checkToken(req, res, next) {
    console.log("checkToken TOKEN MIDDLEWARE");
    try {
        console.log(req.cookies.tokenCookie);
        if (req.cookies.tokenCookie == undefined){
            console.log("MISSING TOKEN!");
            throw new Error
        }
    } catch(error) {
        // SINCE TOKEN DID NOT EXIST , DENY ENTRY
        return res.render("login", {title: "Project Pulse", error: "Missing Token"});
    }
    next();
}

// LOGOUT MIDDLEWARE , CLEAR COOKIES AND TOKEN
async function logoutMiddleware(req, res, next) {
    try {
        console.log("LOGOUT MIDDLEWARE");
        // CLEAR COOKIES FROM BROWSER
        // TOKEN AND USER-AUTHORITY WILL BE REMOVED
        res.clearCookie('tokenCookie', { path: "/manager" }, { domain: "localhost:1337"});
        res.clearCookie('tokenCookie', { path: "/member" }, { domain: "localhost:1337"});
        res.clearCookie('userAuth');
        res.clearCookie('loggedUser');
    } catch(error) {
        return res.render("login", {title: "Project Pulse", error: "Missing Token"});
    }
    next();
}


// DISPLAY GET/POST METHOD FOR EVERY REQUEST
function logIncomingToConsole(req, res, next) {
    console.info(`Incoming request: ${req.path} (${req.method}).`);
    next();
}

// EXPORT MIDDLEWARE
module.exports = {
    logIncomingToConsole: logIncomingToConsole,
    authenticateLogin: authenticateLogin,
    checkToken: checkToken,
    logoutMiddleware: logoutMiddleware
};
