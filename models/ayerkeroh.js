const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    celsius: String,
    humidity: String,
    rain: String,
    distance: 
}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;