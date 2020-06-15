const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 7000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware(
    {
        src : './assets/scss',
        dest : './assets/css',
        debug : true,
        outputStyle : 'expanded',
        prefix : '/css',
    }
));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract layout and scripts form sub pages 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



// setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

// mogo store is used to store the session cookie in the db
app.use(session({
    name : 'codeial',
    // TODO change the secret key before deployment
    secret : "iamyourdoom",
    saveUninitialized : false,
    resave : false,
    cookie : { 
        maxAge : (1000 * 60 * 100)
    },
    store : new MongoStore(
        {
            mongooseConnection : db,
            autoRemove : false,
        }
        ,function(err){
            console.log(err || "connect-mongo setup ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`error in running the server: ${err}`);
    }
    console.log('Server is running on port',port);
})
