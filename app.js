const express = require('express');
var app = express();
var port = 2200;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/SampleProductRequestDatabase");

var sampleproductRequestsSchema = new mongoose.Schema({
    usertId: String,
    productId: String
});

var User = mongoose.model("User",sampleproductRequestsSchema);

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/sample-product-request.html");
});

app.post("/sampleProductRequest", (req, res) => {
    var myData = new User(req.body);
    myData.save()
    .then(item => {
    res.send("item saved to database"+item);
    res.send(myData);
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
   });

app.listen(port,()=>{
    console.log("server is running on port "+port);
});