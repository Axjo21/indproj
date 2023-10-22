---
Title: Documentation
Description: Project Pulse Documentation
hidden: true
---

<div markdown="1">

# Documentation page


## General information about the project. <br>

The project is developed using Node.js and Express.js and the main app is in the root of the project, "app.js". Type "node app.js" in the terminal to start the application. The application will then run on "localhost:1337".
"localhost:1337/manager" is hope-page for managers. "localhost:1337/member" is the home page for members, and "localhost:1337" is the login page. Based on who you log in as, you get redirected to propper route and have access to the proper data. 

In app.js the application is initialized with port etc. 
Middleware and routes are used.
-Note that app.js specifies where the routes will be activated.. (either on "/manager" or "member").

Mails are sent to new users when submitted through CSV. Add yourself to the csv-file and submit it to get your own account!

As an end user you interact with the .ejs files in "/views". 
Much of the functionality is dictated by the manager.js and member.js routes. 

These routes make function calls to functions in "/src", which in turn often makes call to database procedures in "sql/pulse".

The database that's used is MariaDB.
The database is backuped in "backup.sql". 
See config/db/pulse.json for database user and password.

The application implements role based authentication using JWT.
The application sends out mails to new members using Nodemailer and Gmail.

### How do i start the application?<br>

Type "node app.js" in the terminal when you are in the root of the project.
You can then log in to the system using the following already created accounts:

#### Login as Manager using:<br>
username = aoj@mail.com

password = 123abc

#### Login as Member using:<br>
username = team-member@mail.com

password = abc123

### How do i reset the database? <br>

Go to "/sql/pulse" and write "mariadb --table < reset.sql".

### Something went wrong when creating users through CSV!<br>

Make sure your csv-file matches the format used in "uploads/uploaded_file.csv".

### How do i add myself as a user? <br>

Copy "uploads/uploaded_file.csv" and add your own information. Then submit it when creating members through CSV. 

You should now have recieved an email containing your password. 
Use the password and your email to login to the application!

### How do i reset the database? <br>

Go to "/sql/pulse" and write "mariadb --table < reset.sql".




## Contents / File-structure: <br>

### /Config: <br>
Specifies which database to use.


### /Middleware: <br>
-Check if the password matches against encrypted password stored in the database when logging in.

-Setting tokens if login is successful.

-Checking if tokens are set when accessing routes.

-Clear cookies when logging out.


### /Public: <br>
CSS, favicon, image.


### /Route: <br>
Routes for /member and /manager.


### /SQL/Pulse: <br>
SQL for creating tables and columns and procedures.


### /Src: <br>
Manager specific functions in "functions.js"
Member specific functions in "memberFunctions.js"
Functions for sending emails in "mailer.js"


### Check out .env file to inspect some of the global variables!

### Package.json
Here are the modules that this project makes use of.

Some notable modules include: Bcrypt, Cookie-Parser, JsonWebToken, Multer and Nodemailer.

### Known bugs / missing functionality:<br>
-Team members do not get sent emails reminding them of upcoming report-deadlines.

-You cannot select a single member and assign to project.


## Project created by:
Axel Jönsson (canvas: axjo21)
## You can reach me on my personal mail:
axel.oj@outlook.com
## Or on Discord: 
ax_oj

</div>
