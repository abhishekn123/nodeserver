const express = require('express');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const File = require('fs');
const app = express();
const userstore = require('../model/user')
const router = express.Router();
var validuser =[{}];
const bodyparser = require('body-parser');
app.use(bodyparser.json())
const user = require('../model/user')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee"
  });
  con.connect(function(err) {
    if(err)
    {
        console.log(err);
    }
    console.log("Connected!");
  });
router.post('/reg',(req,res)=>
{
    let userdata = req.body;
    con.query(`insert into register (email,password) values("${userdata.email}","${userdata.password}")`, function (err, result, fields) {
    if (err) 
    {
       res.send(err);
    }
    let payload = {subject : userdata.email}
    let token = jwt.sign(payload,'secretkey');
    res.status(200).send({token});
    });   
});
router.post('/log',(req,res)=>
{
    let userdata = req.body;  
    con.query(`select email,password from register where email = "${userdata.email}" and password = "${userdata.password}"`, function (err, result) {
    if (err) 
    {
   res.send("No user found please register")
    }
     if(result.length >0)   
     {
           
        let payload = {subject : result.email}
        let token = jwt.sign(payload,'secretkey');
        res.status(200).send({token});
     }
     else
     {
         res.status(401).send("Login Failed");
     }
    });   
});
router.post('/validateuser',verifytoken,(req,res)=>
{
    console.log(req.token);
   jwt.verify(req.token,'secretkey',(err,data)=>
   {
       if(err)
       {
           res.send('invalid');
       }
       else
       {
         
           res.send({value:'valid'});
       }
   });
   
});
function verifytoken(req,res,next)
{
    const BearerHeader = req.headers.authorization.split(' ')[1];
    if(typeof BearerHeader!== 'undefined')
    {
        //const bearer = BearerHeader.split(' ');
        //const bearertoken = bearer[1];
        req.token = BearerHeader;
      //let payload =  jwt.verify(req.token,'secretkey')
        next();
    }
    else
    {
        res.sendStatus(401);
    }
}
module.exports=router;