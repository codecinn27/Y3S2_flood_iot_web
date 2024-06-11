const axios = require("axios");
const moment = require('moment-timezone');
const Data = require('../models/data'); // Import the Data model
const { AyerKeroh, DurianTunggal } = require('../models/data2');

// Define a function to get the location name based on the id
const getLocationName = (id) => {
    let locationName;
    switch(id){
        case 'ayerkeroh':
            locationName = "Ayer Keroh";
            break;
        case 'duriantunggal':
            locationName = "Durian Tunggal";
            break;
        case 'alorgajah':
            locationName = "Alor Gajah";
            break;
        default:
            return null; // Return null for invalid id
    }
    return locationName;
};

function setDefaultSessionValues(req) {
    if (!req.session.userid) {
        req.session.userid = 'ayerkeroh';
    }
    if (!req.session.locationName) {
        req.session.locationName = 'Ayer Keroh';
    }
}

const saveData = async (id, location) => {
    let status = '';

    if (id === 'ayerkeroh') {
        const latestData = await AyerKeroh.findOne().sort({ createdAt: -1 });
        if (latestData) {
            status = latestData.status;
        }
    } else if (id === 'duriantunggal') {
        const latestData = await DurianTunggal.findOne().sort({ createdAt: -1 });
        if (latestData) {
            status = latestData.status;
        }
    }

    const data = {
        id: id,
        locationName: location,
        status: status
    };

    return data;
};

function formatDateAndTime(timestamp) {
    const date = new Date(timestamp);

    // Extracting date components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
    const day = date.getDate();

    // Extracting time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatting date and time
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { date: formattedDate, time: formattedTime };
}


module.exports.dashboardPage = (req,res)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    res.render('iot/dashboard');
}

//dashboard version 1 
module.exports.switchCollection = async (req,res, next)=>{
    const {id} = req.params;
    
    // Set session variables
    req.session.userid = id;
    req.session.locationName = getLocationName(id);
    // Check if location name is valid
    if (!req.session.locationName) {
        return res.status(400).json({ error: 'Invalid collection id' });
    }
    const data = await saveData(req.session.userid, req.session.locationName);
    res.render('iot/dashboard',  { data});
}

module.exports.getDataAyerKeroh = async(req,res)=>{
    try {
        //do a logic and get the session id and decide which id data to take
        const response = await axios.get(process.env.GET_DATA_AYER_KEROH, {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': process.env.API_KEY_AYER_KEROH
          }
        });

        //console.log("response: ",response);
        const result = response.data.results;
        //console.log("from getDataAyerKeroh, line 198 result:",result);

        const formattedData = result.map(item => ({
            celsius: parseFloat(item.data.celsius).toFixed(2),
            fahrenheit: parseFloat(item.data.fahrenheit).toFixed(2),
            humidity: parseFloat(item.data.humidity).toFixed(2),
            rain: item.data.rain, // Assuming rain data does not need formatting
            rainValue: parseFloat(item.data.rainValue).toFixed(2),
            distance: parseFloat(item.data.distance).toFixed(2),
            status: item.data.status,
            ...formatDateAndTime(item.timestamp)

        }));
        const latestData = await AyerKeroh.findOne().sort({ updatedAt: -1 });
        // Check if there is new data to save
        let newDataToSave = false;

        if (latestData) {
            for (let data of formattedData) {
                if (
                    data.celsius !== latestData.celsius ||
                    data.fahrenheit !== latestData.fahrenheit ||
                    data.humidity !== latestData.humidity ||
                    data.rain !== latestData.rain ||
                    data.rainValue !== latestData.rainValue ||
                    data.distance !== latestData.distance ||
                    data.status !== latestData.status
                ) {
                    newDataToSave = true;
                    break;
                }
            }
        } else {
            newDataToSave = true;
        }

        if (newDataToSave) {
            // Save new data to the database
            const savedDataPromises = formattedData.map(async (data) => {
                const newData = new AyerKeroh(data);
                await newData.save();
            });

            await Promise.all(savedDataPromises);
            console.log("from /getAyerKerohData",formattedData);
            return res.json(formattedData);
        } else {
            console.log("No new data to save into Ayer Keroh Database");
            return res.json(formattedData);
        }

      } catch (error) {
        console.error('Error fetching Ayer Keroh data:', error);
        res.status(500).json({ error: 'Failed to fetch Ayer Keroh data' });
      }
}

module.exports.getDataDurianTunggal = async(req,res)=>{
    try {
        //do a logic and get the session id and decide which id data to take
        const response = await axios.get(process.env.GET_DATA_DURIAN_TUNGGAL, {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': process.env.API_KEY_DURIAN_TUNGGAL
          }
        });

        //console.log("response: ",response);
        const result = response.data.results;
        //console.log("from getDataDurianTunggal, line 266 result:",result);

        const formattedData = result.map(item => ({
            celsius: parseFloat(item.data.celsius).toFixed(2),
            fahrenheit: parseFloat(item.data.fahrenheit).toFixed(2),
            humidity: parseFloat(item.data.humidity).toFixed(2),
            rain: item.data.rain, // Assuming rain data does not need formatting
            rainValue: parseFloat(item.data.rainValue).toFixed(2),
            distance: parseFloat(item.data.distance).toFixed(2),
            status: item.data.status,
            ...formatDateAndTime(item.timestamp)
        }));
        const latestData = await DurianTunggal.findOne().sort({ updatedAt: -1 });
        // Check if there is new data to save
        let newDataToSave = false;

        if (latestData) {
            for (let data of formattedData) {
                if (
                    data.celsius !== latestData.celsius ||
                    data.fahrenheit !== latestData.fahrenheit ||
                    data.humidity !== latestData.humidity ||
                    data.rain !== latestData.rain ||
                    data.rainValue !== latestData.rainValue ||
                    data.distance !== latestData.distance ||
                    data.status !== latestData.status
                ) {
                    newDataToSave = true;
                    break;
                }
            }
        } else {
            newDataToSave = true;
        }

        if (newDataToSave) {
            // Save new data to the database
            const savedDataPromises = formattedData.map(async (data) => {
                const newData = new DurianTunggal(data);
                await newData.save();
            });

            await Promise.all(savedDataPromises);
            console.log("from /getDurianTunggalData",formattedData);
            return res.json(formattedData);
        } else {
            console.log("No new data to save into Durian Tunggal Database");
            return res.json(formattedData);
        }

      } catch (error) {
        console.error('Error fetching Durian Tunggal data:', error);
        res.status(500).json({ error: 'Failed to fetch Durian Tunggal data' });
      }
}

//latest version
module.exports.renderingData = async(req,res)=>{
    try{
        const {id} = req.params;
    
        if (id) {
            // Set session variables from params
            req.session.userid = id;
            req.session.locationName = getLocationName(id);
            // Check if location name is valid
            if (!req.session.locationName) {
                return res.status(400).json({ error: 'Invalid collection id' });
            }
        } else {
            // Set default session values if no id is provided
            setDefaultSessionValues(req);
        }
        const data = await saveData(req.session.userid, req.session.locationName);
        let response;
        let baseUrl;

        // Determine the base URL based on the environment
        if (process.env.NODE_ENV === 'production') {
            baseUrl = 'https://iotfloodberr.azurewebsites.net';
        } else {
            baseUrl = 'http://localhost:3000';
        }

        // Fetch the appropriate data based on the id
        if (data.id === 'duriantunggal') {
            response = await axios.get(`${baseUrl}/iot/getDurianTunggalData`);
        } else if (id === 'ayerkeroh') {
            response = await axios.get(`${baseUrl}/iot/getAyerKerohData`);
        } else {
            throw new Error("Invalid location id");
        }

        // Check if response contains data
        const responseData = response.data;
        if (!Array.isArray(responseData) || responseData.length === 0) {
            throw new Error("No data returned from the endpoint");
        }

        // Pass the data to the template
        console.log("Rendering Data from Ayer Keroh",responseData[0]);
        res.render('iot/dashboard', { favoriotData: responseData[0], data });
        
    }catch(error){
        console.error('Error fetching data from Favoriot', error);
        res.status(500).json({error: 'Failed to fetch data from Favoriot renderingData controller errors'});
    }
}

module.exports.dataLogDisplay = async(req,res,next)=>{
    const {id} = req.params;
    
    if (id) {
        // Set session variables from params
        req.session.userid = id;
        req.session.locationName = getLocationName(id);
        // Check if location name is valid
        if (!req.session.locationName) {
            return res.status(400).json({ error: 'Invalid collection id' });
        }
    } else {
        // Set default session values if no id is provided
        setDefaultSessionValues(req);
    }
    // Prepare data object
    const data = await saveData(req.session.userid, req.session.locationName);
    let latestTenData;
    // Get the latest data, sampled every 1 minute
    if(data.id =="ayerkeroh"){
        latestTenData = await AyerKeroh.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        hour: { $hour: "$createdAt" },
                        minute: { $minute: "$createdAt" }
                    },
                    latestEntry: { $last: "$$ROOT" }
                }
            },
            { $sort: { "latestEntry.createdAt": -1 } },
            { $limit: 10 },
            { $replaceRoot: { newRoot: "$latestEntry" } }
        ]);
    }else if(data.id == "duriantunggal"){
        latestTenData = await DurianTunggal.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        hour: { $hour: "$createdAt" },
                        minute: { $minute: "$createdAt" }
                    },
                    latestEntry: { $last: "$$ROOT" }
                }
            },
            { $sort: { "latestEntry.createdAt": -1 } },
            { $limit: 10 },
            { $replaceRoot: { newRoot: "$latestEntry" } }
        ]);        
    }else {
        return res.status(400).json({ error: 'Invalid location id dataLogDisplay' });
    }

    res.render('iot/datalog',  { data, favoriot_data:latestTenData}); 
}

module.exports.notificationDisplay = async(req,res,next)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    const data = await saveData(req.session.userid, req.session.locationName);

    let ayerKerohAlerts = await AyerKeroh.find({ status: { $in: ['Danger', 'Warning'] } });
    ayerKerohAlerts = ayerKerohAlerts.map(alert => ({
        ...alert.toObject(), // Convert mongoose document to plain object
        location: "Ayer Keroh"
    }));
    console.log(ayerKerohAlerts);

    let durianTunggalAlerts = await DurianTunggal.find({ status: { $in: ['Danger', 'Warning'] } });
    durianTunggalAlerts = durianTunggalAlerts.map(alert => ({
        ...alert.toObject(), // Convert mongoose document to plain object
        location: "Durian Tunggal"
    }));

    // Combine both alert arrays
    let alertStatuses = [...ayerKerohAlerts, ...durianTunggalAlerts];

    // Sort the combined alerts by createdAt in descending order
    //compared all the time one by one and sort the latest value infront
    alertStatuses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    //console.log(alertStatuses);
    res.render('iot/notification',{data, alertStatuses} );
}

module.exports.analysis= async(req,res,next)=>{
    const {id} = req.params;
    
    if (id) {
        // Set session variables from params
        req.session.userid = id;
        req.session.locationName = getLocationName(id);
        // Check if location name is valid
        if (!req.session.locationName) {
            return res.status(400).json({ error: 'Invalid collection id' });
        }
    } else {
        // Set default session values if no id is provided
        setDefaultSessionValues(req);
    }
    const data = await saveData(req.session.userid, req.session.locationName);
    res.render('iot/analysis',{data})
}

module.exports.about = async(req,res, next)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    const data = await saveData(req.session.userid, req.session.locationName);
    res.render('iot/about', {data});
}

module.exports.getLatestData = async (req, res) => {
    try {
        const latestData = await Data.findOne().sort({ updatedAt: -1 });
        if (!latestData) {
            return res.status(404).json({ message: 'No data found' });
        }
        res.json(latestData);
    } catch (error) {
        console.error('Error fetching latest data:', error);
        res.status(500).json({ error: 'Failed to fetch latest data' });
    }
};
