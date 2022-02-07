const express=require('express');
const cookieParser=require('cookie-parser');

const app=express();//running the express function
const port=8000;  //when we deploy our product then we change our port to 80
//require the layouts
const expressLayout=require('express-ejs-layouts');

//importing mongoose file for database
const db=require('./config/mongoose');

app.use(express.urlencoded());

app.use(cookieParser());

//now saying to express to use this layout before the router
app.use(expressLayout);

//saying express to use static files
app.use(express.static('./assets'));


//extract style and script from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//use express router
app.use('/',require('./routes/index'));

//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err)
{
    if(err)
    {
        console.log(`Error in running the server : ${err}`);
        return;
    }

    console.log(`Server is running on Port: ${port}`);

    

});