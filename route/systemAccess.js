/**
 * Route for project.
 */
"use strict";

// RETRIEVE DEPENDENCIES
const express   = require("express");
const router    = express.Router();



// LOGIN GET
router.get("/", (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    res.render("login", data);
});

// LOGIN POST
router.post("/", (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    res.render("login", data);
});

// AUTHENTICATE LOGIN
router.post("/authenticate", (req, res) => {
    // POST ROUTE FOR MIDDLEWARE
});



module.exports = router;
