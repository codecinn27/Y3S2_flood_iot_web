const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    date: { type: Date, default: Date.now },
    //time: { type: String, required: true },
    celsius: { type: Number, required: true },
    distance: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rain: { type: String, required: true },
    //status: { type: String, enum: ['safe', 'moderate', 'warning', 'danger', 'highly danger'], required: true }
});

const AyerKeroh= mongoose.model('AyerKeroh', observationSchema);
const DurianTunggal = mongoose.model('DurianTunggal', observationSchema);
const AlorGajah = mongoose.model('AlorGajah', observationSchema);

module.exports = {
    AyerKeroh,
    DurianTunggal,
    AlorGajah
};
