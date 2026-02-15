const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, html) => {
    try {
        // ALWAYS log to console for development/debugging
        console.log("--------------------------");
        console.log(`Sending Email to: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log("--------------------------");

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Pizza App" <no-reply@pizzaapp.com>',
            to: email,
            subject: subject,
            text: text,
            html: html
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email sent failed", error);
    }
};

module.exports = sendEmail;
