// for ayer keroh and durian tunggal
require('dotenv').config();
const mongoose = require('mongoose');
const { AyerKeroh, DurianTunggal } = require('../models/data2');  // Adjust the path as necessary

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');

        await AyerKeroh.deleteMany({});
        await DurianTunggal.deleteMany({});
        console.log('Existing data cleared');

    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedDB();
