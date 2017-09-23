var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }

    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    res.send(req.session.token);
});


router.get('/getAllUsers',getAllUsers);

function getAllUsers(req, res){
    userService.getAllUsers()
        .then(function(user){
            if(user){
                res.send(user);
            }else{
                res.sendStatus(404);
            }
    }).catch(function(err){
        res.status(400).send(err);
    })
}

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;