const mongoose = require('mongoose');
const { AyerKeroh, DurianTunggal, AlorGajah } = require('./models/observation'); // Import your observation models

// Connect to MongoDB
//database connection
require('dotenv').config();
const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => console.log("Database is connected..."))
  .catch((err) => console.log(err));
// Seed data for Ayer Keroh collection
const ayerKerohData = [
    {
        time: '08:00',
        temperature: 25,
        waterLevel: 1.5,
        humidity: 70,
        rainLevel: 0.5,
        status: 'safe'
    },
    {
        time: '12:00',
        temperature: 28,
        waterLevel: 1.8,
        humidity: 65,
        rainLevel: 1.2,
        status: 'moderate'
    },
    {
        time: '16:00',
        temperature: 30,
        waterLevel: 2.0,
        humidity: 60,
        rainLevel: 2.5,
        status: 'warning'
    }
];

// Seed data for Durian Tunggal collection
const durianTunggalData = [
    {
        time: '08:00',
        temperature: 25,
        waterLevel: 1.5,
        humidity: 70,
        rainLevel: 0.5,
        status: 'safe'
    },
    {
        time: '12:00',
        temperature: 28,
        waterLevel: 1.8,
        humidity: 65,
        rainLevel: 1.2,
        status: 'moderate'
    },
    {
        time: '16:00',
        temperature: 30,
        waterLevel: 2.0,
        humidity: 60,
        rainLevel: 2.5,
        status: 'warning'
    }
];

// Seed data for Alor Gajah collection
const alorGajahData = [
    {
        time: '08:00',
        temperature: 25,
        waterLevel: 1.5,
        humidity: 70,
        rainLevel: 0.5,
        status: 'safe'
    },
    {
        time: '12:00',
        temperature: 28,
        waterLevel: 1.8,
        humidity: 65,
        rainLevel: 1.2,
        status: 'moderate'
    },
    {
        time: '16:00',
        temperature: 30,
        waterLevel: 2.0,
        humidity: 60,
        rainLevel: 2.5,
        status: 'warning'
    }
];

// Function to insert data for each collection
const seedData = async () => {
    try {
        await AyerKeroh.deleteMany();
        await DurianTunggal.deleteMany();
        await AlorGajah.deleteMany();
        await AyerKeroh.insertMany(ayerKerohData);
        await DurianTunggal.insertMany(durianTunggalData);
        await AlorGajah.insertMany(alorGajahData);
        console.log('Data seeding successful');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.disconnect(); // Close the database connection
    }
};

seedData();
