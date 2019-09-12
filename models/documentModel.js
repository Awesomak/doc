const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
	filename: String,
	creator: String,
	access: [ String ]
});

module.exports = Document = mongoose.model('Document', DocumentSchema);
