"use strict";



require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    try {
        const oauth2Client = new OAuth2(
                process.env.OAUTH_CLIENT_ID,
                process.env.OAUTH_CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            );

                oauth2Client.setCredentials({
                refresh_token: process.env.OAUTH_REFRESH_TOKEN,
            });

            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        console.log("*ERR: ", err)
                        reject();
                    }
                    resolve(token); 
                });
            });
    
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.MAIL_USERNAME,
                    accessToken,
                    clientId: process.env.OAUTH_CLIENT_ID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                },
            });
            return transporter;
        } catch (err) {
            return err
        }
};


const sendMail = async () => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: "Welcome to Project Pulse!",
            text: "Hi, this is a test email. Within it: your psw.",
        }
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(mailOptions);
    } catch (err) {
        console.log("ERROR: ", err)
    }
};

const mailSender = async (recipient, title, content) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: recipient,
            subject: `${title}`,
            text: `${content}`,
        }
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(mailOptions);
    } catch (err) {
        console.log("ERROR: (recipient: ", recipient, ")", err)
    }
};

module.exports = {
    sendMail: sendMail,
    mailSender: mailSender
};
