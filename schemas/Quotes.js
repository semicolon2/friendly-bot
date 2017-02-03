const mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
    id: Number,
    guild: String,
    quote: String
});

module.exports = mongoose.model('quotes', quoteSchema);
