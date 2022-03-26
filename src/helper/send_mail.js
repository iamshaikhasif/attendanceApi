
const nodemailer = require('nodemailer');

exports.sendMail = (to_mail, subject, mail_body) => {
    return new Promise(async (resolve, reject) => {
        try {
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", //'smtp.gmail.com',
                port: 587, //465
                secure: false, // secure:true for port 465, secure:false for port 587
                auth: {
                    // user: process.env.FROM, //"kshitij@aiolos.solutions",
                    // pass: process.env.PASSWORD
                    user: "asifan82869@gmail.com",
                    pass: "asif@1234"
                }
            });

            var mailOptions = {
                from: ``, // sender address (who sends)
                to: to_mail, // list of receivers (who receives)
                // cc: process.env.CC,
                subject: subject, // Subject line
                text: '', // plaintext body
                html: mail_body // html body
                
            }

            transporter.sendMail(mailOptions, function (error, info) {

                if (error) {
                    reject(error)
                }
                let sendMailResponse = info && info.response ? info.response : 'Send Mail Error'
                resolve(sendMailResponse);
            })
        } catch (err) {
            // logger.error('sendMail Catch Err:', err)
            reject(err)
        }
    });
}


