const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    data1: String,
    data2: String,
    data3: String,
    data4: String
}, {
    timestamps: true
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;