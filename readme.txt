first step is to make a index.js file
second step is npm init command in index.js

//Folders information
mongodb settings will be stored in the config folder or any other settings
routes is storing all your destination from the browser means path ( /home or /profile and after this controllers will be called ex app.get and those functions will be stored in controllers )
models stores the schema 
and views stores the different html files



now the next step is fireup our express server
  -first we install express(npm install express)
  -then require it in index.js file(const express=require('express'))
  -then const app=express();
  -then we define port
  -then app.listen command for running our server


then we add nodemon index.js in the package.json in the start key so that we don't have to write nodemon index.js bari bari 
so we now write npm start to run our server

then we intialize the git repositry by writing command gitint 
then we make .gitignore file so that we ignore the node_modules files because it is heavy file
then we write git add . and commit 

then we load our routes



