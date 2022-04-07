const express=require('express');
const cookieParser=require('cookie-parser');

const app=express();//running the express function
const port=8000;  //when we deploy our product then we change our port to 80
//require the layouts
const expressLayout=require('express-ejs-layouts');

//importing mongoose file for database
const db=require('./config/mongoose');

//used for session cookie
const session = require('express-session');

//for authentication passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//setting up mongostore
const MongoStore = require('connect-mongo');

//requiring sass middleware for using sass
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'

}));


app.use(express.urlencoded());

app.use(cookieParser());

//now saying to express to use this layout before the router
app.use(expressLayout);

//saying express to use static files
app.use(express.static('./assets'));


//extract style and script from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');



//middleware which takesup the session cookie and encrypts it
//mongostore is used to store the session cookies in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:MongoStore.create({
        
        mongoUrl: 'mongodb://localhost/codeial_development',
        autoRemove:'disabled',
    },function(err){
        console.log(err || 'connect-mongdb setup');
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/',require('./routes/index'));


app.listen(port,function(err)
{
    if(err)
    {
        console.log(`Error in running the server : ${err}`);
        return;
    }

    console.log(`Server is running on Port: ${port}`);

    

});