const express=require('express');
const app=express();//running the express function
const port=8000;  //when we deploy our product then we change our port to 80


app.listen(port,function(err)
{
    if(err)
    {
        console.log(`Error in running the server : ${err}`);
        return;
    }

    console.log(`Server is running on Port: ${port}`);

    

});