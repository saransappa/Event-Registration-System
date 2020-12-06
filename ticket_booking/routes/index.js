//Ticket Booking

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const request = require('request');
const { json } = require('express');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/" + "index.html");
});

router.get('/login',function(req,res){
  res.sendFile(__dirname + "/" + "login.html");
});

router.get('/register',function(req,res){
  res.sendFile(__dirname + "/" + "register.html");
});

router.get('/admin_view_ticket_details',function(req,res){

  html = "<!--Ticket Booking--><html><head><script> function check_creds(form) { username = form.username.value; password = form.password.value; if (username == '' && password== '' )alert (\"Please enter credentials\");else if (password == '') alert (\"Please enter Password\");  else if (username == '') alert (\"Please enter Username\"); } </script></head><body style=\"background-image: url('https://wallpaperboat.com/wp-content/uploads/2019/10/free-website-background-07.jpg');\"><center><h1>Admin View Ticket Details</h1><form action = \"/check_admin_creds_get_ticket_details\" method = \"POST\" onSubmit=\"return check_creds(this)\">Username: <input type = \"text\" name = \"username\"> <br><br>Password: <input type = \"password\" name = \"password\"> <br><br>Event : <select name=\"event\"><option value=\"default\">Select an event</option>";
  
  var json_file;
	request.get({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9999/event_list',
		}, function(error, response, body){
			if(!error){
		  		//console.log(body);
				json_file = JSON.parse(body);
				console.log(json_file);
		  		var s = "<option value=";
				var t = "</option>"

		  		for(var i=0;i<json_file.length;i++){

					var k = s+ JSON.stringify(json_file[i].name) + ">"+ json_file[i].name+t;
					html+=k;

		  		}
		  		html+= "</select><br><br><input type = \"submit\" value = \"Submit\"></form></center></body></html>";
		  		res.send(html);
			}
			else{
				console.log(error);
			}
	});

});

router.get('/admin_remove_event',function(req,res){

  html = "<!--Ticket Booking--><html><head><script> function check_creds(form) { username = form.username.value; password = form.password.value; if (username == '' && password== '' )alert (\"Please enter credentials\");else if (password == '') alert (\"Please enter Password\");  else if (username == '') alert (\"Please enter Username\"); } </script></head><body style=\"background-image: url('https://wallpaperboat.com/wp-content/uploads/2019/10/free-website-background-07.jpg');\"><center><h1>Admin View Ticket Details</h1><form action = \"http://localhost:3000/check_admin_creds_remove_event\" method = \"POST\" onSubmit=\"return check_creds(this)\">Username: <input type = \"text\" name = \"username\"> <br><br>Password: <input type = \"password\" name = \"password\"> <br><br>Event : <select name=\"event\"><option value=\"default\">Select an event</option>";
  
  var json_file;
	request.get({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9999/event_list',
		}, function(error, response, body){
			if(!error){
		  		//console.log(body);
				json_file = JSON.parse(body);
				console.log(json_file);
		  		var s = "<option value=";
				var t = "</option>"

		  		for(var i=0;i<json_file.length;i++){

					var k = s+ JSON.stringify(json_file[i].name) + ">"+ json_file[i].name+t;
					html+=k;

		  		}
		  		html+= "</select><br><br><input type = \"submit\" value = \"Submit\"></form></center></body></html>";
		  		res.send(html);
			}
			else{
				console.log(error);
			}
	});

});


router.get('/admin_add_event',function(req,res){
	res.sendFile(__dirname + "/" +"admin_add_event.html");
});



router.get('/about',function(req,res){
	res.sendFile(__dirname + "/" +"about.html");
});

router.post('/register_check',urlencodedParser,function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.confirm_password);
  
  var data = "username="+req.body.username + "&password="+req.body.password+"&confirm_password="+req.body.confirm_password;
  request.post({
	  headers: {'content-type' : 'application/x-www-form-urlencoded'},
	  url:     'http://localhost:8000/register_post',
	  body:    data
	}, function(error, response, body){
	  console.log(body);
	  var req_result = body;
	  if(req_result=="success"){
	  	console.log("Successfully registered!")
	  	res.sendFile(__dirname + "/" + "login.html");
	  }
	  else if(req_result=="mongo_error"){
	  	console.log("Mongo DB error");
	  }
	  else if(req_result=="user_exists"){
	  	console.log("Existing user");
		res.sendFile(__dirname + "/" + "login.html");
	  }
	  else if(req_result=="pass_mismatch"){
	  	console.log("Password mismatch");
	  	
	  }
	}
  );
});

router.post('/login_check',urlencodedParser,function(req,res){
  console.log(req.body.username);
  console.log(req.body.password);
  event_html = "<!--Event--><meta charset=\"UTF-8\"><html> <head><title>Event selection</title></head><body style=\"background-image: url('https://wallpaperboat.com/wp-content/uploads/2019/10/free-website-background-07.jpg');\"><center><form action = \"/event_post\" method = \"POST\">Email Id: <input type = \"text\" name = \"email\"> <h5> Note: If you are not able to find an event in the list, it means that the tickets are no longer available.</h5>Event : <select name=\"event\" ><option value=\"default\">Select an event</option>";
	var json_file;
	request.get({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9999/event_list',
		}, function(error, response, body){
			if(!error){
		  		console.log(body);
		  		json_file = JSON.parse(body);
		  		var s = "<option value=";
		  		var t = "</option>"
		  		for(var i=0;i<json_file.length;i++){
		  			if(json_file[i].count>0){
			  			var k = s+ JSON.stringify(json_file[i].name) + ">"+ json_file[i].name+t;
			  			event_html+=k;
		  			}
		  		}
		  		event_html+= "</select><input type = \"submit\" value = \"Submit\"></form></center></body></html>"
		  		console.log(event_html);
				return;
			}
			else{
				console.log(error);
			}
	});
	//res.send(event_html);
  var data = "username="+req.body.username + "&password="+req.body.password;
  request.post({
	  headers: {'content-type' : 'application/x-www-form-urlencoded'},
	  url:     'http://localhost:8000/login_post',
	  body:    data
	}, function(error, response, body){
	  console.log(body);
	  var req_result = body;
	  if(req_result=="user_exists"){
	  	console.log("Login successful!");
		console.log(event_html);
	  	res.write(event_html);
		return ;
	  }
	  else if(req_result=="mongo_error"){
	  	console.log("Mongo DB error");
	  }
	  else if(req_result=="wrong_creds"){
	  	console.log("Incorrect credentials!");
	  }
	}
  );
  res.send();
});

router.post('/event_post',urlencodedParser, function(req,res){
	console.log(req.body.event);
	console.log(req.body.email);
	var event_name = req.body.event;
	var data = "event="+req.body.event +"&email="+req.body.email;
	var output = "";
	request.post({
	  headers: {'content-type' : 'application/x-www-form-urlencoded'},
	  url:     'http://localhost:9000/generate',
	  body:    data
	}, function(error, response, body){
		if(!error){
	  		if(body){
	  			data =data+ "&ticket="+body;
	  			request.post({
				  headers: {'content-type' : 'application/x-www-form-urlencoded'},
				  url:     'http://localhost:8888/send',
				  body:    data
				}, function(err, respo, bod){
					if(!err){
						console.log(bod);
					  	console.log("done");
					  	var request_data = "event="+event_name;
					  	request.post({
							  headers: {'content-type' : 'application/x-www-form-urlencoded'},
							  url:     'http://localhost:9999/ticket_generated',
							  body:    request_data
							}, function(error_, response_, body_){
							  	if(!error_){
							  		console.log(body_);
							  	}
							}
						  );
					}
				  	else{
				  		console.log(err);
				  	}
				}
			  );
	  			res.send("You will get a mail with event and ticket details. If you don't get it in few minutes, register again.");
	  		}
	  		else{
	  			res.send("Ticket generation failed. Try again!");
	  		}
		}
		else{
			console.log(error);
		}
	}
  	);
});

router.post('/check_admin_creds_get_ticket_details',urlencodedParser, function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var event = req.body.event;
	var data = "event="+event;
	console.log(data);
	if(username == "saransappa" && password == "saran532216"){
		request.post({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9000/admin',
		  body: data
		}, function(error, response, body){
			if(!error){
		  		res.send(body);
			}
			else{
				console.log(error);
			}
		}
  		);
	}
	else res.send("invalid request");
});

router.post('/check_admin_creds_add_event',urlencodedParser, function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var event = req.body.event;
	var count = req.body.count;
	var data = "event="+event+"&count="+count;
	console.log(data);
	if(username == "saransappa" && password == "saran532216"){
		request.post({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9999/add_event',
		  body: data
		}, function(error, response, body){
			if(!error){
		  		res.send(body);
			}
			else{
				console.log(error);
			}
		}
  		);
	}
	else res.send("invalid request");
});

router.post('/check_admin_creds_remove_event',urlencodedParser, function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var event = req.body.event;
	var data = "event="+event;
	console.log(data);
	if(username == "saransappa" && password == "saran532216"){
		request.post({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://localhost:9999/remove_event',
		  body: data
		}, function(error, response, body){
			if(!error){
		  		res.send(body);
			}
			else{
				console.log(error);
			}
		}
  		);
	}
	else res.send("invalid request");
});


module.exports = router;
