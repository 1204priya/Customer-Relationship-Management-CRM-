
const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service :"gmail",
    auth : {
        user : "pr548011@gmail.com",
        pass : "wcxocrbbwewpoxlk"
    }
}); 




