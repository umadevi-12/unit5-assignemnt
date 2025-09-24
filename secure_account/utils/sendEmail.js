const nodemailer = require('nodemailer');

const sendEmail = async(options) =>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.ENTHERAL_USER,
            pass:process.env.ENTHERAL_PASS,
        }

    });

    const message = {
        from:`Support < ${process.env.ENTHERAL_USER}>`,
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    const info = await transporter.sendMail(message);

    console.log('Message URL:%s', nodemailer.getTestMessageUrl(info));

};
module.exports = sendEmail;