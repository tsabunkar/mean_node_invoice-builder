import nodemailer from 'nodemailer';
import htmlToText from 'html-to-text';


const sendEmail = (options) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: process.env.FAKE_HOST,
            port: process.env.FAKE_PORT,
            auth: {
                user: process.env.FAKE_EMAIL,
                pass: process.env.FAKE_PASSWORD
            }
        });

        const beautyText = htmlToText.fromString(options.html, {
            wordwrap: 130
        });

        const mailOptions = {
            from: `I M TEJAS <${process.env.FAKE_EMAIL}>`, //person who is sending this email
            to: options.email, //to whom this detail shld be send
            subject: options.subject,
            text: beautyText,
            html: options.html

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            } else {
                console.log('message id', info.messageId);
                console.log('preview URL', nodemailer.getTestMessageUrl(info));

                return resolve({
                    message: 'Reset Email has been sent to you inbox bro!'
                });
            }
        });


    });
};


module.exports = {
    sendEmail
};