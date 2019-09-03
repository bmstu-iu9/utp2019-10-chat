'use strict'

const nodemailer = require('nodemailer')

exports.service = 'tutanota'
exports.user = 'QuickChatIU9@tutanota.com'
exports.password = '42m-EaW-xwf-2br'

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
	        to: email,
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
