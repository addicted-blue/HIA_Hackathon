var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var urlencode = require('urlencode');
var msg = urlencode('hello js');
var http = require('http');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
        	
        	
        	var toNumber = req.body.mobile;
            var msg = 'Hi, Welcome to HIA! you have registered successfully to Public Property Maintenance Portal. For any queries, kinldy visit www.sunnypuri.in';
            
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
                //res.json(str);
              });
            }//console.log('hello js'))
            http.request(options, callback).end();//url encode instalation need to use $ npm install urlencode*/
            
        	
        	
        	
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}