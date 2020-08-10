const nodeMailer = require('../config/nodemailer');

exports.newResetLink = (token)=>{
    console.log("inside reset link mailer");
    let htmlString = nodeMailer.renderTemplate({token : token}, './password-reset/new_password_link.ejs');

    nodeMailer.transporter.sendMail({
        from : "kumarehlan@gmail.com",
        to : token.user.email,
        subject : "Password rest link",
        html : htmlString,

    }, (err, info) =>{
        if(err){console.log("Erro in sending mail", err);return;}
        console.log("mail sent", info);
        return;
    });
}

