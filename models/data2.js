const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the data
const dataSchema = new Schema({
    celsius: String,
    fahrenheit: String,
    humidity: String,
    rain: String,
    rainValue: String,
    distance: String,
    status: String
}, {
    timestamps: true
});

// Create models for AyerKeroh and DurianTunggal using the same schema
const AyerKeroh = mongoose.model('AyerKeroh', dataSchema);
const DurianTunggal = mongoose.model('DurianTunggal', dataSchema);

// Export both models
module.exports = { AyerKeroh, DurianTunggal };
