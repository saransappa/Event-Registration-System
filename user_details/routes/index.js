// User details

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://admin:adminpassword@cluster0.spqrw.mongodb.net/test?retryWrites=true&w=majority";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'User_details' });
});

router.post('/register_post',urlencodedParser,function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.confirm_password);
  
  var pass = req.body.password;
  var conf_pass = req.body.confirm_password;
  if(pass!=conf_pass){
  	res.send("pass_mismatch");
  }	
  else{
  	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Database');
  	  const db = client.db('users');
  	  const detailsCollection = db.collection('details');
  	  var object = {username: req.body.username, password: req.body.password};
  	  detailsCollection.findOne(object, function(error, result) {
	    if (!error) {
	      if (result) {
		console.log("Item exists");
		res.send("user_exists");
	      } 
	      else {
		console.log("Item not exists");
		detailsCollection.insertOne(object)
	  	  .then(result=>{
	  	  	res.send("success");
	  	  })
	  	  .catch(err=> console.log(err))
	  	  
	      }
	    } else {
	      console.log("MongoDB error");
	      res.send("mongo_error");
	    }
	  });
	})
  }
});

router.post('/login_post',urlencodedParser, function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	console.log(username);
	console.log(password);
	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Database');
  	  const db = client.db('users');
  	  const detailsCollection = db.collection('details');
  	  var object = {username: req.body.username, password: req.body.password};
  	  detailsCollection.findOne(object, function(error, result) {
	    if (!error) {
	      if (result) {
		console.log("Item exists");
		res.send("user_exists");
	      } 
	      else {
		console.log("Item not exists");
		res.send("wrong_creds");
	      }
	    } else {
	      console.log("MongoDB error");
	      res.send("mongo_error");
	    }
	  });
	})
});

module.exports = router;
