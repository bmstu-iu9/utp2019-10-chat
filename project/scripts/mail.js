'use strict'

const nodemailer = require('nodemailer')

exports.service = 'yandex'
exports.user = 'QuickChatIU9@yandex.ru'
exports.password = 'hBs-RaT-6sb-nWA'

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
