const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const nodemailer = require('nodemailer');
const port = 2200;

var app = express();

//send email
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'pgangrade1994@gmail.com',
        pass: '0407G@ng'
    },
    tls: {rejectUnauthorized: false},
    debug:true
});

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//view engine
app.set('views',__dirname+'/views');
app.set('view engine' ,'jade');


// mongoose connection
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/SampleProductRequestDatabase");

var sampleproductRequestsSchema = new mongoose.Schema({
    customerName: String,
    customerEmailId: String,
    productTitle: String
});

var User = mongoose.model("User",sampleproductRequestsSchema);

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/sample-product-request.html");
});

app.get("/reqAccep",(req,res)=>{
    res.render('reqAccept',{users : docs});
});

app.get('/send',function(req,res){
    var mailOptions={
        to : 'pgangrade1994@gmail.com',
        subject : 'Sample product Request',
        html : 'customer email Id :'+req.query.customerEmail+'  customer name :'+req.query.customerName+'   product Title : '+req.query.productTitle
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            //console.log("Message sent: " + response);
            var response1 = {
                "message":"sent"
             };
            console.log(response1);
            res.json({success : "Updated Successfully", status : 200}).end("sent");
        }
    });
});

app.get('/list',function(req,res){
    User.find({},function(err,docs){
        if(err) res.json(err);
        else res.render('list',{users : docs});
    });
});

app.post("/sampleProductRequestList", (req, res) => {
    var myData = new User(req.body);
    myData.save(function(err,doc){
        if(err) res.json(err);
        else res.redirect('/list')
    });
   });


   app.listen(port,function(){
    console.log('server connected on port '+port);
});