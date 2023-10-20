/**
 * A module exporting functions to access the pulse database.
 */
"use strict";

module.exports = {
    viewProject: viewProject,
    viewMyProjects: viewMyProjects,
    viewMyReports: viewMyReports,
    viewSingleReport: viewSingleReport,
    submitSingleReport: submitSingleReport,
    accessibilityCheck: accessibilityCheck
};

// configurate database etc
const mysql  = require("promise-mysql");
const config = require("../config/db/pulse.json");

let db;

// MAIN DB CONNECTION FUNCTION
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

// VIEW PROJECT BY MEMBER
async function viewProject(email) {
    let sql = `CALL view_project(?);`;
    let res;
    res = await db.query(sql, [email]);
    return res[0];
}

// VIEW ALL PROJECTS BY MEMBER
async function viewMyProjects(email) {
    let projectList = [];
    let result;

    let sql = `
        SELECT 
            proj.name AS 'name',
            proj.summary AS 'summary',
            proj.start AS 'start',
            proj.end AS 'end'
        FROM projects AS proj
            JOIN project_members AS p_m
                ON p_m.fk_project = proj.name
        WHERE
            p_m.fk_person = "${email}"
        ;`;

    result = await db.query(sql);

    console.log(result);
    console.log(result[0]);
    let project;
    for (const projectInfo of result){
        console.log("projInfo    " + projectInfo.name);
        project = await viewProject(projectInfo.name);
        console.log(project);
        projectList.push(project);
    }
    return projectList;
}



// VIEW ALL OF MY REPORTS
async function viewMyReports(email) {
    let result;
    let sql = `CALL view_my_reports(?)`;

    result = await db.query(sql, [email]);

    return result[0];
}

// VIEW SINGLE REPORT
async function viewSingleReport(id) {
    let result;
    let sql = `CALL view_single_report(?)`;

    result = await db.query(sql, [parseInt(id)]);
    //console.log(result);
    //console.log(result[1]);
    return result[0];
}

// SUBMIT SINGLE REPORT
async function submitSingleReport(id, content) {
    let result;
    let sql = `CALL submit_report(?, ?, ?)`;

    result = await db.query(sql, [parseInt(id), "Submitted", content]);
    //console.log(result);
    //console.log(result[1]);
    return result[0];
}

// CHECK IF USER IS ALLOWED ACCESS TO REPORT
async function accessibilityCheck(reportId, email) {
    let result;
    let sql = `CALL report_owner(?)`;
    result = await db.query(sql, [parseInt(reportId)]);

    if (result[0][0].fk_person == email){
        console.log("ACCESS GRANTED");
        return "ok";
    }
    console.log("ACCESS DENIED");
    return "not ok";
}
