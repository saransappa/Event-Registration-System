var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const {v4 : uuidv4} = require('uuid'); 
const request = require('request');
const MongoClient = require('mongodb').MongoClient
const uri = ""; // Enter your mongodb server url string

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/generate',function(req,res){
  var event_name = req.body.event;
  var emailId = req.body.email;
  const unique = uuidv4();
  var datetime = new Date();
  var ticket_id = event_name+"_"+ unique + "_" + emailId;
  ticket_id = ticket_id.toLowerCase();
  console.log(ticket_id);
  MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Tickets Database');
  	  const db = client.db('tickets');
  	  const detailsCollection = db.collection('details');
  	  var object = {event:event_name, email: emailId, ticket: ticket_id };
  	  detailsCollection.findOne(object, function(error, result) {
	    if (!error) {
	      if (result) {
		console.log("Item exists");
		res.send("ticket_exists");
	      } 
	      else {
		console.log("Item not exists");
		detailsCollection.insertOne(object)
	  	  .then(result=>{
			
	  	  	res.send(ticket_id);
	  	  })
	  	  .catch(err=> console.log(err))
	  	  
	      }
	    } else {
	      console.log("MongoDB error");
	      res.send("mongo_error");
	    }
	  });
	})
});


router.post('/admin',urlencodedParser,function(req,res){
	//var event = req.body.event;
	var query = {event: req.body.event};
	console.log(query);
	  MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Tickets Database');
  	  const db = client.db('tickets');
  	  const detailsCollection = db.collection('details');
  	  detailsCollection.find(query).toArray(function(err, result) {  
		if (err) throw err;  
		res.send(result);
		});  
	})
	
});	

module.exports = router;
