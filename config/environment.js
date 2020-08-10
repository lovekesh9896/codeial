const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const deveploment = {
    name : 'development',
    asset_path : '/assets',
    session_cokkie_key : 'blahsomething',
    db : 'codeial_development',
    smtp : {
        service : "gmail",
        host : "smtp.gmail.com",
        port : 587,
        secure : false,
        auth : {
            user : "kumarmehlan@gmail.com",
            pass : "loki@nanu",
        }
    },
    google_client_id : "97581914775-9k3rue5i7nk7cnhi39iil3lu1mfllbon.apps.googleusercontent.com",
    google_client_secret : "Cy-RAJNEXoWi1rKjhUBQzQFZ",
    google_callback_url : "http://localhost:8000/users/auth/google/callback",
    jwt_secret_key : 'codeial',
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}
    }
}

const production = {
    name : 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    session_cokkie_key : process.env.CODEIAL_SESSION_COKKIE_KEY,
    db : process.env.CODEIAL_DB,
    smtp : {
        service : "gmail",
        host : "smtp.gmail.com",
        port : 587,
        secure : false,
        auth : {
            user : process.env.CODEIAL_GMAIL_USERNAME,
            pass : process.env.CODEIAL_GMAIL_PASSWORD,
        }
    },
    google_client_id : process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url : process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret_key : process.env.CODEIAL_JWT_SECRET_KEY,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT)== undefined ? deveploment : eval(process.env.CODEIAL_ENVIRONMENT);