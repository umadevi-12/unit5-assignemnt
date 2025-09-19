const express = require('express');
const nodemailer = require('nodemailer');
require("dotenv").config();

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

app.get('/sendemail', async (req, res) => {
    try {
        let info = await transporter.sendMail({
            from: `"uma student" <${process.env.EMAIL_USER}>`,
            to: ["umaaofficial12@gmail.com", "venugopal.burli@masaischool.com"],
            subject: "Testing mail",
            text: "This is a testing mail sent by uma student, no need to reply this is not mandatory",
        });

        res.send(`Email sent success : ${info.response}`);
    } catch (error) {   
        console.error("Error sending email:", error);
        res.status(500).send("error sending email");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
