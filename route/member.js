/**
 * Route for project.
 */
"use strict";

// RETRIEVE DEPENDENCIES
const express   = require("express");
const router    = express.Router();
const functions = require("../src/memberFunctions.js");

// LOGOUT , CLEAR TOKEN AND COOKIES
router.get("/logout", (req, res) => {
    res.redirect("/");
    res.end();
});


// HOME PAGE
router.get("/", async (req, res) => {
    console.log("INDEX");
    let reports;
    let email;
    
    email = req.cookies.loggedUser.username;

    reports = await functions.viewMyReports(email);
    let data = {
        title: "Project Pulse",
        reports: reports
    };

    console.log("logging reports", reports);
    console.log("reports logged")
    res.render("member/index", data);
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

    res.render("member/view-report", data);
});


// submit report
router.post("/submit/:id", async (req, res) => {
    let reportId = req.params.id;
    let content = req.body.reportContent;
    
    let report;
    let email = req.cookies.loggedUser.username;
    let accessibilityCheck = await functions.accessibilityCheck(reportId, email);


    if (accessibilityCheck == "ok"){
        let submitted = "yes";
        await functions.submitSingleReport(reportId, content);
        //data.submitted = "submitted";
        report = await functions.viewSingleReport(reportId);
        let data = {
            title: `Showing report ${reportId}`,
            report: report,
            submitted: submitted
        };
        res.render("member/view-report", data);
    }

    //data.notSubmitted = "not submitted";
    report = await functions.viewSingleReport(reportId);
    let data = {
        title: `Showing report ${reportId}`,
        report: report,
        notSubmitted: "yes"
    };
    res.render("member/view-report", data);
});


// VIEW PROJECTS
router.get("/view-project", async (req, res) => {
    let projectList;
    let email;
    
    email = req.cookies.loggedUser.username;
    console.log("view my projects route: (me)   " + email)
    projectList = await functions.viewMyProjects(email);
    let data = {
        title: "Project Pulse",
        projInfo: {
            projectList: projectList
        }
    };
    res.render("member/view-proj", data);
});



module.exports = router;
