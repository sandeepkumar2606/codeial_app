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

const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');

//setting up mongostore
const MongoStore = require('connect-mongo');

//requiring sass middleware for using sass
const sassMiddleware = require('node-sass-middleware');

//requiring the connect flash
const flash = require('connect-flash');

//requiring the middleware that we have made for the flash messages
const customMware = require('./config/middleware'); 

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000); 
console.log('chat server is listening on port 5000');


app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'

}));


app.use(express.urlencoded());

app.use(cookieParser());

//saying express to use static files
app.use(express.static('./assets'));

//make the upload path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

//now saying to express to use this layout before the router
app.use(expressLayout);




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

//use the flash after the session is being set
app.use(flash());

//use the customeMiddleware
app.use(customMware.setFlash);


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