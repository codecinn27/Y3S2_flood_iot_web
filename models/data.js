const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    title: String,
    price: Number
});

module.exports = mongoose.model('Data', DataSchema);