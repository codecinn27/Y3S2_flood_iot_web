// for ayer keroh and durian tunggal
require('dotenv').config();
const mongoose = require('mongoose');
const { AyerKeroh, DurianTunggal } = require('../models/data2');  // Adjust the path as necessary


const seedData = [
    { celsius: '30', fahrenheit:"90.68", humidity: '70', rain: 'yes',rainValue:'3800' , distance: '5',status:'Danger' },
    { celsius: '32', fahrenheit:"90.68", humidity: '65', rain: 'no', rainValue:'2800',distance: '10',status: 'Warning'},
    { celsius: '28', fahrenheit:"90.68", humidity: '80', rain: 'yes',rainValue:'3500' , distance: '3',status:'Danger' },
    { celsius: '29', fahrenheit:"90.68", humidity: '75', rain: 'no', rainValue:'2800' ,distance: '7',status:'Warning' }
];

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

        await AyerKeroh.insertMany(seedData);
        await DurianTunggal.insertMany(seedData);

        console.log('Seed data inserted');

    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedDB();
