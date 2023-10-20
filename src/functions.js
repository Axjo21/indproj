/**
 * A module exporting functions to access the pulse database.
 */
"use strict";

module.exports = {
    showPersons: showPersons,
    create_users_csv: create_users_csv,
    showPasswords: showPasswords,
    createProject: createProject,
    assignMembers: assignMembers,
    getUserRole: getUserRole,
    showMembers: showMembers,
    viewProject: viewProject,
    viewAllProjects: viewAllProjects,
    createReport: createReport,
    viewAllReports: viewAllReports,
    viewSingleReport: viewSingleReport,
    commentReport: commentReport,
    createSingleReport: createSingleReport,
    assignSingleMember: assignSingleMember
    //checkIfLoggedIn: checkIfLoggedIn
};

// configurate database etc
const mysql  = require("promise-mysql");
const config = require("../config/db/pulse.json");
const mailer = require('./mailer.js');

const csv = require('csv-parser');
const fs = require('fs');
//const CryptoJS = require("crypto-js");
//let hash = CryptoJS.SHA256(password);
//let hashTxt = hash.toString(CryptoJS.enc.Hex);
const bcrypt = require("bcrypt");

let db;

// MAIN DB CONNECTION FUNCTION
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();


// get users "authorization" from DB
async function getUserRole(email) {
    let sql = `CALL get_user_role(?);`;
    let res;

    res = await db.query(sql, [email]);
    console.log(res);
    return res[0][0].authorization;
}

// CREATE NEW PROJECT
async function createProject(name, summary, start, end) {
    let sql = `CALL create_project(?, ?, ?, ?);`;
    let res;

    res = await db.query(sql, [`${name}`, `${summary}`, `${start}`, `${end}`]);
    console.log(res);
    return res[0];
}

// ASSIGN MEMBERS TO PROJECT
async function assignMembers(project, members) {
    let sql = `CALL assign_members(?, ?);`;
    let res;
    //let testingMembers = [members];
    //const memberArray = testingMembers.split(",");
    /*
    if (testingMembers.length <=1 && testingMembers.split(",") != Array()){
        console.log("single member");
        res = await db.query(sql, [project, `${members}`]);
        console.log(res);
        return res[0];
    }
    */
    for (const member of members){
        console.log("many members", member);
        res = await db.query(sql, [project, `${member}`]);
        console.log(res);
    }
    return res[0];
}

// ASSIGN SINGLE MEMBER TO PROJECT
async function assignSingleMember(project, member) {
    let sql = `CALL assign_members(?, ?);`;
    let res;

    console.log("single member");
    res = await db.query(sql, [project, `${member}`]);
    console.log(res);
    return res[0];
}


// ADD FUNCTIONALITY TO DATE
// IN ORDER TO INCREMENT A DATE WITH DAYS
// SO THAT WE CAN SET CORRECT DEADLINES
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// CREATE NEW REPORT and assign to member
async function createReport(project, frequency, start, end, members) {
    let sql = `CALL create_report(?, ?, ?);`;
    let res;
    console.log("start", start);
    console.log("end", end);
    console.log("frequency", frequency);
    let date1 = new Date(start);
    let date2 = new Date(end);
    console.log(date1);
    console.log(date2);
    console.log(members);
    const differenceInTime = date2.getTime() - date1.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    console.log("days between dates:   ", differenceInDays);
    let divider;

    // tanken med "grace" är att försöka hantera de fall då en rapport inte skapas
    // för att den inte innefaller inom ramen för projektets start-slut
    // för att hantera detta, så har vi en grace, som ska skjuta fram rapporten ngn dag.
    let grace;

    if (frequency == "daily") {
        divider = 1;
        grace = 0;
    } else if (frequency == "weekly") {
        divider = 7;
        grace = 5;
    } else if (frequency == "fortnightly") {
        divider = 14;
        grace = 10;
    } else if (frequency == "monthly") {
        divider = 30;
        grace = 20;
    }
    let deadline;
    let addedDays;
    let times;
    // save deadlines!
    times = differenceInDays / divider;


    for (let i = 1; i < times; i++) {
        addedDays = i * divider;
        deadline = date1.addDays(addedDays);
        console.log("deadline", deadline);
        for (const member of members[0]){
            console.log(member);
            // before call to procedure. Make deadline calculation and send as arg
            // ish start, divider, x
            res = await db.query(sql, [`${member}`, project, deadline]);
            console.log(res);
        }
    }
    console.log(res);
    return res[0];
}

// CREATE ONE NEW REPORT and assign to member
async function createSingleReport(member, project, deadline) {
    let sql = `CALL create_report(?, ?, ?);`;
    let date1 = new Date(deadline);

    let res = await db.query(sql, [`${member}`, project, date1]);
    console.log(res);

    return res[0];
}

// VIEW ALL REPORTS
async function viewAllReports() {
    let result;
    let sql = `CALL view_all_reports();`;

    result = await db.query(sql);
    //console.log(result);
    //console.log(result[0]);
    //console.log(result[1]);
    return result[0];
}

// VIEW SINGLE REPORT
async function viewSingleReport(id) {
    let result;
    let sql = `CALL view_single_report(?)`;

    result = await db.query(sql, [parseInt(id)]);
    if (result[0][0].status == "Submitted"){
        sql =
            `UPDATE reports
            SET 
                status = "Read"
            WHERE
                id LIKE ${id}
            ;`;
        await db.query(sql);
        sql = `CALL view_single_report(?)`;
        result = await db.query(sql, [parseInt(id)]);
    }

    //console.log(result[1]);
    return result[0];
}

// COMMENT SINGLE REPORT
async function commentReport(id, comment) {
    let sql;
    //let sql = `CALL comment_report(?, comment)`;
    sql =
        `UPDATE reports
        SET 
            comment = ?
        WHERE
            id LIKE ?
        ;`;
    await db.query(sql, [comment, parseInt(id)]);

    return;
}


// VIEW PROJECT BY NAME
async function viewProject(name) {
    let sql = `CALL view_project(?);`;
    let res;
    res = await db.query(sql, [name]);
    //console.log(res);
    return res[0];
}

// VIEW PROJECTS
async function viewAllProjects() {
    let projectList = [];
    let result;

    let sql = `SELECT * FROM projects;`;
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


// SHOW ALL USERS IN DB
async function showPersons() {
    let sql = `CALL show_persons();`;
    let res;

    res = await db.query(sql);
    console.log(res);
    return res[0];
}
// SHOW ALL MEMBERS IN DB
async function showMembers(search) {
    let sql = `CALL show_members(?);`;
    let res;

    res = await db.query(sql, [search]);
    console.log(res[0]);
    return res[0];
}

// SHOW ALL PASSWORDS IN DB
async function showPasswords() {
    let sql;
    let res;
    let values;

    sql = `SELECT * FROM passwords;`;
    res = await db.query(sql);
    console.log("\n");

    for (const row of res) {
        values = [];
        values.push(
            [
                row.fk_person,
                row.password
            ]);
        console.table(
            [
                'Emp ID',
                'Password hash'
            ], values);
    }
}

// CREATE NEW USERS FROM CSV
async function create_users_csv() {
    let sql = 
        `LOAD DATA LOCAL INFILE 'uploads/uploaded_file.csv'
        INTO TABLE persons
        CHARSET utf8
        FIELDS
            TERMINATED BY ','
            ENCLOSED BY '"'
        LINES
            TERMINATED BY '\n'
        IGNORE 1 LINES
        ;`;
    let res;

    await db.query(sql);
    sql = `SELECT email FROM persons;`;
    res = await db.query(sql);

    // CSV - PARSER
    const results = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop0123456789';
    const charLength = chars.length;

    //const new_users = await new Promise((resolve) => {
    fs.createReadStream('uploads/uploaded_file.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        console.log("result from csv-parser");
        console.log(results);
        let new_users = [];

        for (const entry of results) {
            // här får jag ha en if-sats för att hantera ifall
            // entry.email redan finns i databsen ( anv redan finns )
            // typ: if entry.email in list of users -> pass
            let password = '';
            for ( let i = 0; i < 5; i++ ) {
                password += chars.charAt(Math.floor(Math.random() * charLength));
            }
            let hash = await bcrypt.hash(password, 10);
            new_users.push(entry.email);
            // save and add to list -> send list to func as arg?
            console.log("SOME ENTRY: ", entry.email);
            console.log(password);
            console.log(hash);
            const comparison = await bcrypt.compare(password, hash);

            console.log("is right password? ", comparison);
            sql = `CALL assign_password(?, ?);`
            await db.query(sql, [entry.email, hash]);
            let title = `Welcome to Project Pulse ${entry.fornamn, entry.efternamn}!`;
            let content = `Use this password to login to the application! Password: ${password}. Keep it secret, keep it safe.`;
            await mailer.mailSender(entry.email, title, content);
        }

        // GÖR OM DETTA TILL EN FOR-LOOP ?
        // JUST NU SKICKAR JAG BARA TILL DE NEDAN. MEN DET FUNKAR. VILL JU INTE SKICKA TILL RANDOMS.f
        //await mailer.mailSender("axel.oj@outlook.com", "Welcome to Project Pulse Axel!", "This is a hardcoded automated email!");
        //await mailer.mailSender("pulsemanager2@gmail.com", "Welcome to Project Pulse Manager!", "This is a hardcoded automated email!");
        //await mailer.mailSender("teammembermail1@gmail.com", "Welcome to Project Pulse Member!", "This is a hardcoded automated email!");
        //console.log("users before mail func", new_users);
        //const sendingEmail = await mailer.sendEmail(new_users);
        //console.log("after send email func response", sendingEmail);
    })
    /*
    .on('finish', () =>{
        resolve();
    });
    });
    */
    //console.log("new users b4 return: ", new_users);
    return;
}
