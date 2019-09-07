'use strict'

const nodemailer = require('nodemailer')

exports.sendMail = (email, subject, content) => {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: "OAuth2",
				user: 'QuickChatIU9@gmail.com',
				clientId: "40794653725-4hp3j5meghoasrjarbosv3kdqdfkbu0u.apps.googleusercontent.com",
				clientSecret: "y-Uc3QzX8IwZhCz0xILvlnKq",
				refreshToken: "1/sFpo7144zkaEWRYS07_JgWf_futHq08mkhiAaWxvkdY",
				accessToken: "ya29.Glt5B8z_R7jtx6IcBCNKo4pdQGTLj3UHFA52Fvzw57z3C2vH2kSFqbbsqDWw6ZwZ9eQWskf5wnVLvw5ENRceuKEetMtgtXgP01Ji5BEqVP4kWh1FcW_8cJ2RMmrr",
				expires: 1567627710046
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
