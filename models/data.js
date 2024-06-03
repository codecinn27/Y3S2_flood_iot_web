const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    celsius: String,
    humidity: String,
    rain: String,
    rainValue: String,
    distance: String,
    status: String
}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;