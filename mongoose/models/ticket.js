var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({
	
	requestType: String,
	description: String,
	address: String,
	latitude: String,
	longitude: String,
	status: {type: String, default: 'open'},
	isDeleted: {type: Boolean, default: false},
	createdOn: {type: Date, default: Date.now},
	severity: {type: String, default: 'low'},
	assignedTo: String,
	assignedToName: String,
	createdBy: String,
	createdByName: String,
	comments: String
});

module.exports = mongoose.model('ticket', ticketSchema);

