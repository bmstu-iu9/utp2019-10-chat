'use strict'
exports.invoke = null

const nodemailer = require('nodemailer')

exports.service = 'gmail'
exports.user = 'QuickChatIU9@gmail.com'
exports.password = 'BkwUJgLjEP8y2N2'

exports.sendMail = (email, subject, content) => {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			service: exports.service,
			auth: {
				user: exports.user,
	            pass: exports.password
	        }
	    });
	
	    let mailOptions = {
	        from: exports.user,
	        to: args.email,
	        subject: subject,
	        text: content
	    };
	
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            reject(error)
	        } else {
	            resolve(info)
	        }
	    });
	})
}
