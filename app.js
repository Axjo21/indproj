/**
 * A sample Express server with static resources.
 */
"use strict";

// SETUP AND LIBRARIES
const port    = process.env.DBWEBB_PORT || 1338;
const path    = require("path");
const express = require("express");
const app     = express();
//const routePulse = require("./route/pulse.js");
const routeAccess = require("./route/systemAccess.js");
const routeManager = require("./route/manager.js");
const routeMember = require("./route/member.js");

const middleware = require("./middleware/authentication.js");
const cookieParser = require('cookie-parser');


// CONFIGURE APP
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// MIDDLEWARE
app.listen(port, logStartUpDetailsToConsole);
app.use(middleware.logIncomingToConsole);
app.use("/authenticate", middleware.authenticateLogin);
app.use("/manager/logout", middleware.logoutMiddleware);
app.use("/member/logout", middleware.logoutMiddleware);

//app.use("/pulse", middleware.checkToken);
app.use("/manager", middleware.checkToken);
app.use("/member", middleware.checkToken);

// SPECIFY ROUTES
//app.use("/", routePulse);

app.use("/", routeAccess);
app.use("/manager", routeManager);
app.use("/member", routeMember);

/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });
    console.info("STARTING INDPROJ!");
    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
