const express=require('express');
const app=express();//running the express function
const port=8000;  //when we deploy our product then we change our port to 80
//require the layouts
const expressLayout=require('express-ejs-layouts');
//now saying to express to use this layout before the router
app.use(expressLayout);

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