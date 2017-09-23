var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	
	name: String,
	userName: String,
	mobile: String,
	role: String,
	hash: String

});

module.exports = mongoose.model('user', userSchema);

