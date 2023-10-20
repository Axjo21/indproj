/**
 * Route for project.
 */
"use strict";

// RETRIEVE DEPENDENCIES
const express   = require("express");
const router    = express.Router();
const functions = require("../src/functions.js");

const mailer = require("../src/mailer.js");

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


// LOGOUT , CLEAR TOKEN AND COOKIES
router.get("/logout", (req, res) => {
    res.redirect("/");
    res.end();
});


// HOME PAGE
router.get("/", async (req, res) => {
    console.log("INDEX");

    // MAIL FUNKTIONEN NEDAN FUNKAR
    //await mailer.sendMail();
    let reports;

    reports = await functions.viewAllReports();
    let data = {
        title: "Project Pulse",
        reports: reports
    };

    console.log("logging reports", reports);
    console.log("reports logged")
    res.render("manager/index", data);
});

// show single report
router.get("/view/:id", async (req, res) => {
    let id = req.params.id;
    let report;
    report = await functions.viewSingleReport(id);
    let data = {
        title: `Showing report ${id}`,
        report: report
    };

    res.render("manager/view-report", data);
});

// show single report
router.post("/comment/:id", async (req, res) => {
    let id = req.params.id;
    let comment = req.body.reportComment;

    await functions.commentReport(id, comment);

    res.redirect(`/manager/view/${id}`);
});

// CREATE NEW MEMBERS USING CSV
router.get("/csv", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    functions.showPasswords();
    res.render("manager/csv", data);
});

// RETRIEVE SUBMITTED CSV AND CREATE USERS
router.post("/parse-csv", upload.single('uploaded_file'), async (req, res) => {

    console.log(req.file);
    console.log(req.file.originalname);
    //let new_users = 

    //FUNKTIONEN ANROPAR ÄVEN MAIL
    await functions.create_users_csv();
    res.redirect("/manager/csv");
});

// PRESENT USERS IN A TABLE
router.get("/visa", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    data.res = await functions.showMembers('member');
    res.render("manager/visa", data);
});


// CREATE PROJECTS AS MANAGER
router.get("/create-project", async (req, res) => {
    let data = {
        title: "Project Pulse"
    };
    data.res = await functions.showMembers('member');
    res.render("manager/create-proj", data);
});

// INIT NEWLY CREATED PROJECT
router.post("/init-project", async (req, res) => {
    // INITIALIZE VARIABLES
    let projectName;
    let projectSummary;
    let projectMembers;
    let projectStart;
    let projectEnd;
    let reportFrequency;

    // ASSIGN VARIABLES FROM FORM DATA
    projectName = req.body.projectName;
    projectMembers = req.body.projectMember;
    projectSummary = req.body.projectSummary;
    projectStart = req.body.projectStart;
    projectEnd = req.body.projectEnd;
    reportFrequency = req.body.reportFrequency;

    // INITIALIZE CUSTOM DATES
    let custom1 = req.body.customDate1;
    let custom2 = req.body.customDate2;
    let custom3 = req.body.customDate3;
    let custom4 = req.body.customDate4;
    let customDates = [custom1, custom2, custom3, custom4];

    // PRINT TO CONSOLE FOR DEBUGGING
    console.log("rep freq", reportFrequency);
    console.log(projectName);
    console.log(projectSummary);
    console.log(projectMembers);

    console.log(projectStart);
    console.log(projectEnd);
    console.log("frequency", reportFrequency);

    // CREATE PROJECT
    await functions.createProject(projectName, projectSummary, projectStart, projectEnd);

    // IF NO MEMBERS ARE ASSIGNED, DON'T CREATE REPORTS EITHER
    if (projectMembers == null && projectMembers == "") {
        res.redirect(`view-single-project/${projectName}`);
    }
    // ASSIGN MEMBERS
    /*
    console.log("proj length", projectMembers.length);
    if (projectMembers.length > 20){
        console.log("")
        // ASSIGN SINGLE MEMBER
        await functions.assignSingleMember(projectName, projectMembers);
        // CREATE REPORTS IF CUSTOM DATES ARE SET
        for (const customDate of customDates) {
            if (customDate != null && customDate != "") {
                await functions.createSingleReport(projectMembers, projectName, customDate);
            }
        }
    */
    //} else {
    // ASSIGN MULTIPLE MEMBERS
    await functions.assignMembers(projectName, projectMembers);
    // CREATE REPORTS IF CUSTOM DATES ARE SET
    for (const customDate of customDates) {
        if (customDate != null && customDate != "") {
            // CREATE ONE REPORT FOR EACH TEAM MEMBER
            for (const member of projectMembers) {
                console.log(member);
                console.log(projectMembers[member]);
                //await functions.createSingleReport(projectMembers[member], projectName, customDate);
            }
        }
    }
    
    // CREATE REPORTS IF FREQUENCY IS SET
    if (reportFrequency != null && reportFrequency != "") {
        console.log("rep freq is set!");
        await functions.createReport(projectName, reportFrequency, projectStart, projectEnd, [projectMembers]);
    }


    res.redirect(`view-single-project/${projectName}`);
});

// show single project
router.get("/view-single-project/:id", async (req, res) => {
    let id = req.params.id;
    let project;
    project = await functions.viewProject(id);
    console.log(project);
    let data = {
        title: `Showing project ${id}`,
        project: project
    };

    res.render("manager/view-single-proj", data);
});

// VIEW PROJECTS
router.get("/view-project", async (req, res) => {
    let projectList;
    projectList = await functions.viewAllProjects();
    let data = {
        title: "Project Pulse",
        projInfo: {
            projectList: projectList
        }
    };

    res.render("manager/view-proj", data);
});





// SEARCH FUNCTION ( UNUSED )
// USE IT TO SEARCH FOR MEMBERS
router.get("/search", async (req, res) => {
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
    res.render("manager/search", data);
});

module.exports = router;
