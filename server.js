require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var mongoose = require('mongoose');
var http = require('http');

var configDB = require('./config/database');
var Ticket = require('./mongoose/models/ticket');
var User = require('./mongoose/models/user');

var dashboard = require('./config/dashboard');
var urlencode = require('urlencode');
var msg = urlencode('hello js');
const nodemailer = require('nodemailer');

mongoose.connect(configDB.database);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});


app.get('/dashboard', function(req, res){
    return res.json(dashboard);
});

app.get('/getTickets', function(req, res){
    Ticket.find({}, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});

app.get('/getTicketsById/:id', function(req, res){
    Ticket.find({ createdBy: req.params.id }, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});

app.get('/getAssignedTicketsById/:id', function(req, res){
    Ticket.find({ assignedTo: req.params.id }, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});


app.get('/getAssignedTickets/:id', function(req, res){
    Ticket.find({ assignedTo: req.params.id }, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});


app.put('/assignedTicket', (req, res)=>{
       
        Ticket.findOne({ _id: req.body._id }, function (err, data){
            data.assignedTo = req.body.assignedTo;
            data.assignedToName = req.body.assignedToName;
            data.status = req.body.status;
            data.comments = req.body.comments;
            data.save(function(err) {
                if(err)
                    return res.json(err);
                res.json('Ticket Assigned');
            });
        });
        
});

app.put('/closeTicket', (req, res)=>{
    
    Ticket.findOne({ _id: req.body._id }, function (err, data){
        data.status = req.body.status;
        data.vendorComments = req.body.vendorComments;
        data.save(function(err) {
            if(err)
                return res.json(err);
            res.json('Ticket closed');
        });
    });
    
});


app.get('/getUsers', function(req, res){
    User.find({}, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});

app.get('/getVendors', function(req, res){
    User.find({role: 'vendor'}, function(err, data){
       if(err){
           return res.json(err);
       }
        return res.json(data);
    });
});


app.put('/updateUserRole', (req, res)=>{
       
        User.findOne({ _id: req.body._id }, function (err, data){
            data.role = req.body.role;
            data.save(function(err) {
                if(err)
                    return res.json(err);
                res.json('Role Updated');
            });
        });
        
});


app.post('/saveTicket', (req, res)=>{
       
        var ticket = new Ticket();
        
        ticket.requestType = req.body.requestType;
        ticket.description = req.body.description;
        ticket.address     = req.body.address;
        ticket.createdBy   = req.body.createdBy;
        ticket.createdByName = req.body.createdByName;
        ticket.latitude    = req.body.latitude;
        ticket.longitude   = req.body.longitude;
    
        ticket.save(function(err, data) {
            if (err)
                return res.json(err);
            
            return res.json(data);
        });
        
});


app.get('/sms',(req,res,next)=>{
    
    /*var id = req.params.id;*/
    
    var toNumber = req.query.toNumber;
    var msg = req.query.msg;
    
    var username = 'sunsunny.com@gmail.com';
    var hash = 'bd2488522903b14102151f76b1072789a6d1370db6b5f221b40a64ecd1a02185'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
    var sender = 'txtlcl';
    var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg.split(' ').join('%20');
    var options = {
      host: 'api.textlocal.in', path: '/send?' + data
    };
    callback = function (response) {
      var str = '';//another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });//the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        res.json(str);
      });
    }//console.log('hello js'))
    http.request(options, callback).end();//url encode instalation need to use $ npm install urlencode*/
    
});


app.post('/email', (req, res) => {
	  const output = `
	    <p>SLA Breached Tickets</p>
	    <h3>Ticket Details</h3>
	    <ul>  
	      <li>Ticket No: ${req.body.ticket1}</li>
	      <li>Ticket No: ${req.body.ticket2}</li>
	      <li>Ticket No: ${req.body.ticket3}</li>
	      <li>Ticket No: ${req.body.ticket4}</li>
	      <li>Ticket No: ${req.body.ticket5}</li>
	      <li>Ticket No: ${req.body.ticket6}</li>
	      <li>Ticket No: ${req.body.ticket7}</li>
	    </ul>
	    <h3>Action</h3>
	    <p>${req.body.message}</p>
	  `;

	  // create reusable transporter object using the default SMTP transport
	  let transporter = nodemailer.createTransport({
	    host: 'mail.xtremehackers.com',
	    port: 587,
	    secure: false, // true for 465, false for other ports
	    auth: {
	        user: 'admin@xtremehackers.com', // generated ethereal user
	        pass: '9696114433'  // generated ethereal password
	    },
	    tls:{
	      rejectUnauthorized:false
	    }
	  });

	  // setup email data with unicode symbols
	  let mailOptions = {
	      from: '"HIA IT Team" <admin@xtremehackers.com>', // sender address
	      to: 'sunsunny.com@gmail.com', // list of receivers
	      subject: 'SLA Report - HIA', // Subject line
	      text: 'Hello', // plain text body
	      html: output // html body
	  };

	  // send mail with defined transport object
	  transporter.sendMail(mailOptions, (error, info) => {
	      if (error) {
	          return console.log(error);
	      }
	      console.log('Message sent: %s', info.messageId);   
	      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

	      res.json('Email Sent');
	  });
});





// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});