var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://admin:adminpassword@cluster0.7q1ki.mongodb.net/test?retryWrites=true&w=majority";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/event_list',function(req,res){
	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Tickets Database');
  	  const db = client.db('events');
  	  const detailsCollection = db.collection('names');
  	  detailsCollection.find().toArray(function(err, result) {  
		if (err) console.log(err);  
		res.send(result);
		});  
	})
});

router.post('/ticket_generated',urlencodedParser,function(req,res){
	var query = {name: req.body.event}; 
	
	console.log(query);
	var z; 
	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Tickets Database');
  	  const db = client.db('events');
  	  const detailsCollection = db.collection('names');
  	  detailsCollection.find(query).toArray(function(err, result) {  
		if (err) console.log(err);  
		else {
			z = JSON.stringify(result);
			p = JSON.parse(z);
			q = p[0].count - 1;
			var newvalue = {$set: {count: q}};
			detailsCollection.updateOne(query, newvalue,function(err_,result_){
				if(!err_)res.send("success");
			});
		}
		});  
	})
	//console.log(z);

});

router.post('/add_event',urlencodedParser,function(req,res){
	var event = req.body.event;
	var count_ = req.body.count;
	var query = {name: event};
	var event_add = {name:event,count:count_};
	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Database');
  	  const db = client.db('events');
  	  const detailsCollection = db.collection('names');
  	  
  	  detailsCollection.findOne(query, function(error, result) {
	    if (!error) {
	      if (result) {
		console.log("Item exists");
		res.send("event_exists");
	      } 
	      else {
		console.log("Item not exists");
		detailsCollection.insertOne(event_add)
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
	});
});

router.post('/remove_event',urlencodedParser,function(req,res){
	var event = req.body.event;
	var query = {name: event};

	MongoClient.connect(uri, (err, client) => {
	  if (err) return console.error(err)
  	  console.log('Connected to Database');
  	  const db = client.db('events');
  	  const detailsCollection = db.collection('names');
  	  
  	  detailsCollection.deleteOne(query, function(error, result) {
	    if (!error) {
	      if (result) {
		console.log(event+" deleted");
		res.send(event+" deleted");
	      } 
	      else {
		console.log("No result");
	        res.send("No result");
	      }
	    } else {
	      console.log("MongoDB error");
	      res.send("mongo_error");
	    }
	  });
	});
});

module.exports = router;
