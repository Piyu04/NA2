const express = require('express');
var app = express();
var port = 2200;

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
    emailId: String,
    productId: String
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

app.listen(port,()=>{
    console.log("server is running on port "+port);
});