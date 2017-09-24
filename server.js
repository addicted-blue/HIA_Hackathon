require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var mongoose = require('mongoose');

var configDB = require('./config/database');
var Ticket = require('./mongoose/models/ticket');
var User = require('./mongoose/models/user');

var dashboard = require('./config/dashboard');

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
            data.save(function(err) {
                if(err)
                    return res.json(err);
                res.json('Ticket Assigned');
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




// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});