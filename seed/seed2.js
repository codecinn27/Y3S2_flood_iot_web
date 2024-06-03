// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Data = require('../models/data');  // Adjust the path as necessary


const seedData = [
    { celsius: '30', humidity: '70', rain: 'yes',rainValue:'3800' , distance: '5',status:'Danger' },
    { celsius: '32', humidity: '65', rain: 'no', rainValue:'2800',distance: '10',status: 'Warning'},
    { celsius: '28', humidity: '80', rain: 'yes',rainValue:'3500' , distance: '3',status:'Danger' },
    { celsius: '29', humidity: '75', rain: 'no', rainValue:'2800' ,distance: '7',status:'Warning' }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');

        await Data.deleteMany({});
        console.log('Existing data cleared');

        await Data.insertMany(seedData);
        console.log('Seed data inserted');

    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedDB();
