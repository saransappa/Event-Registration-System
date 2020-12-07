
function mail(email,event, ticket){
	var nodemailer = require('nodemailer');
	var msg = "You are successfully registered for the event "+event + " and your ticket is "+ticket+ " You can click on this link to get the QR code for event entry : https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+ticket;
	
	var html_text = "<center><h1>SSS event bookings</h1><h3> Event name : "+event+"</h3> <h3> Ticket id : "+ticket+"</h3><br><br><img src=\"https://qrickit.com/api/qr.php?d="+ticket+"&addtext=SSS+Events&txtcolor=442EFF&fgdcolor=76103C&bgdcolor=C0F912&qrsize=150&t=p&e=m\" alt=\"QR code not displayable please click the link.\"><br>Click <a href=https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+ticket+">here</a> to get the QR code for event entry.</center>";
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: '', // Enter your mail id
	    pass: ''                    // Enter your mail password
	  }
	});

	var mailOptions = {
	  from: 'sss.events.notifications@gmail.com',
	  to: email,
	  subject: "Ticket details from SSS event bookings",
	  html : html_text
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	    return "failed";
	  } else {
	    return info.response;
	  }
	}); 
}


var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send',urlencodedParser, function(req,res){
	var emailId  = req.body.email;
	var event_name = req.body.event;
	var ticket_id = req.body.ticket;
	res.send(mail(emailId, event_name, ticket_id));
});
module.exports = router;
