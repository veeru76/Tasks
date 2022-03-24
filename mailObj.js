'use strict';
var debug = require('debug')
const nodemailer = require('nodemailer');
const mailconfig = require('./config')
// create reusable transporter object using the default SMTP transport
debug('listening')
const sendEmail = async (options) => {
let transporter = nodemailer.createTransport({
    host: mailconfig.host,
    port: mailconfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: mailconfig.user, // generated ethereal user
      pass: mailconfig.pass, // generated ethereal password
    },
})
  

const mailOptions  = {
    from : 'veeranjaneyaReddy <veeru>',
    to : options.email,
    subject: options.subject,
    text: options.text,

}

await transporter.sendMail(mailOptions)
}
module.exports = sendEmail