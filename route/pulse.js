/**
 * Route for project.
 */
"use strict";

// RETRIEVE DEPENDENCIES
const express   = require("express");
const router    = express.Router();
const functions = require("../src/functions.js");

// USED TO RETRIEVE AND PARSE SUBMITTED CSV
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + ".csv");
    }
});
const upload = multer({ storage: storage });


// LOGIN GET
router.get("/", (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    res.render("pulse/login", data);
});

// LOGIN POST
router.post("/", (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    res.render("pulse/login", data);
});

// AUTHENTICATE LOGIN
router.post("/authenticate", async (req, res) => {
    res.redirect("/pulse");
});

// HOME PAGE
router.get("/pulse", (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    console.log("INDEX");
    res.render("pulse/index", data);
});

// LOGOUT , CLEAR TOKEN AND COOKIES
router.get("/pulse/logout", (req, res) => {
    res.redirect("/");
    res.end();
});

// CREATE NEW MEMBERS USING CSV
router.get("/pulse/csv", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    functions.showPasswords();
    res.render("pulse/csv", data);
});

// RETRIEVE SUBMITTED CSV AND CREATE USERS
router.post("/pulse/parse-csv", upload.single('uploaded_file'), async (req, res) => {
    console.log(req.file);
    console.log(req.file.originalname);
    await functions.create_users_csv();
    res.redirect("/pulse/show-csv");
});

// PRESENT USERS IN A TABLE
router.get("/pulse/visa", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    data.res = await functions.showPersons();
    res.render("pulse/visa", data);
});


// CREATE PROJECTS AS MANAGER
router.get("/pulse/create-project", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    res.render("pulse/create-proj", data);
});

// INIT NEWLY CREATED PROJECT
router.post("/pulse/init-project", async (req, res) => {
    let projectName;
    let projectMembers;
    let projectReports;
    let projectSummary;

    projectName = req.body.projectName;
    projectMembers = req.body.projectMembers;
    projectReports = req.body.projectReports;
    projectSummary = req.body.projectSummary;

    //await functions.createProject(projectName, projectSummary);
    //await functions.assignMembers(projectName, projectMembers);
    let data = {
        title: "Project Pulse",
        projInfo: {
            projectName: projectName,
            projectSummary: projectSummary
        }
    };
    res.render("pulse/view-proj", data);
});




// SEARCH FUNCTION ( UNUSED )
router.get("/pulse/search", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    if (req.query.showSearch) {
        console.log(req.query.showSearch);
        let search;
        search = req.query.showSearch;
        console.log((parseInt(search)));
        if (parseInt(search)) {
            console.log("number");
            data.one = await functions.showIntSearch(search);
        } else {
            console.log("string");
            data.one = await functions.showStrSearch(search);
        }
    }
    //data.res = await functions.showSearch();
    res.render("pulse/search", data);
});

module.exports = router;
