const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const port = 2200;
const nodemailer = require('nodemailer');

var app = express();

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

app.get('/view',function(req,res){
    User.find({},function(err,docs){
		if(err) res.json(err);
		else res.render('list',{users : docs});
	});
});

app.post("/sampleProductRequest", (req, res) => {
    var myData = new User(req.body);
    myData.save(function(err,doc){
        if(err) res.json(err);
        else res.redirect('/view')
    });
   });


   app.listen(port,function(){
    console.log('server connected on port '+port);
});