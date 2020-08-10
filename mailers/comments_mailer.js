const nodeMailer = require('../config/nodemailer');
// const nodemailer = require('../config/nodemailer');

// this is another way of exporting method
exports.newComment = (comment)=>{
    console.log("inside new comment mailer");
    let htmlString = nodeMailer.renderTemplate({comment : comment}, './comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from : "kumarehlan@gmail.com",
        to : comment.user.email,
        subject : "New comment published",
        html : htmlString,

    }, (err, info) =>{
        if(err){console.log("Erro in sending mail", err);return;}
        console.log("mail sent", info);
        return;
    });
}