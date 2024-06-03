//delete all datas

require('dotenv').config();
const mongoose = require('mongoose');
const Data = require('../models/data');  // Adjust the path as necessary

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');

        await Data.deleteMany({});
        console.log('Existing data cleared');

    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedDB();