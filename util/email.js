const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kyr1360@ewhain.net",
        pass: ""
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {smtpTransport};
