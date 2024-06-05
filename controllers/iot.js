const axios = require("axios");
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

const saveData = (id,location)=>{
    const data = {
        id: id,
        locationName: location
    };
    return data;
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
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/dashboard',  { data});
}

//dashboard version 2 
// module.exports.getDataFavoriot = async(req,res)=>{
//     try {
//         const response = await axios.get('https://apiv2.favoriot.com/v2/streams?device_developer_id=dht11_test_1_device@iiotsme&max=1&order=DESC', {
//           headers: {
//             'cache-control': 'no-cache',
//             'content-type': 'application/json',
//             'apikey': process.env.FAVORIOT_API_KEY
//           }
//         });
//         //console.log("response: ",response);
//         const result = response.data.results;
//         const formattedData = result.map(item => ({
//             data1: item.data.data1,
//             data2: item.data.data2,
//             data3: item.data.data3,
//             data4: item.data.data4
//         }));
//         const latestData = await Data.findOne().sort({ updatedAt: -1 });
//         if (!latestData) {
//             return res.status(404).json({ message: 'No data found' });
//         }
//         const newDataToSave = formattedData.filter(data=>{
//             return !(data.data1 === latestData.data1 &&
//                 data.data2 === latestData.data2 &&
//                 data.data3 === latestData.data3 &&
//                 data.data4 === latestData.data4
//             );
//         });
//         if(newDataToSave.length >0){
//             const savedDataPromises = formattedData.map(async (data) => {
//                 const newData = new Data(data);
//                 await newData.save();
//             });
    
//             await Promise.all(savedDataPromises);
//             console.log(formattedData);
//             return res.json(formattedData);
//         }else{
//             console.log("No new data to save");
//             return res.json(formattedData);
//         }

//       } catch (error) {
//         console.error('Error fetching Favoriot data:', error);
//         res.status(500).json({ error: 'Failed to fetch Favoriot data' });
//       }
// }

// module.exports.getDataFavoriot1 = async(req,res)=>{
//     try {
//         //do a logic and get the session id and decide which id data to take
//         const response = await axios.get("https://apiv2.favoriot.com/v2/streams?device_developer_id=flood_ayer_keroh_1_device@iiotsme&max=10&order=DESC", {
//           headers: {
//             'cache-control': 'no-cache',
//             'content-type': 'application/json',
//             'apikey': process.env.API_KEY_AYER_KEROH
//           }
//         });
//         //console.log("response: ",response);
//         const result = response.data.results;
//         console.log(result);
//         res.send(result);
        

//       } catch (error) {
//         console.error('Error fetching Favoriot data:', error);
//         res.status(500).json({ error: 'Failed to fetch Favoriot data' });
//       }
// }

// module.exports.getDataFavoriot = async(req,res)=>{
//     try {
//         //do a logic and get the session id and decide which id data to take
//         const response = await axios.get(process.env.GET_DATA_AYER_KEROH, {
//           headers: {
//             'cache-control': 'no-cache',
//             'content-type': 'application/json',
//             'apikey': process.env.API_KEY_AYER_KEROH
//           }
//         });
//         //console.log("response: ",response);
//         const result = response.data.results;
//         console.log(result);
//         const formattedData = result.map(item => ({
//             celsius: parseFloat(item.data.celsius).toFixed(2),
//             //fahrenheit: parseFloat(item.data.fahrenheit).toFixed(2),
//             humidity: parseFloat(item.data.humidity).toFixed(2),
//             rain: item.data.rain, // Assuming rain data does not need formatting
//             distance: parseFloat(item.data.distance).toFixed(2)
//         }));
//         const latestData = await Data.findOne().sort({ updatedAt: -1 });
//         if (!latestData) {
//             return res.status(404).json({ message: 'No data found' });
//         }
//         const newDataToSave = formattedData.filter(data=>{
//             return !(data.celcius === latestData.celcius &&
//                 data.humidity === latestData.humidity &&
//                 data.rain === latestData.rain &&
//                 data.distance === latestData.distance
//             );
//         });
//         if(newDataToSave.length >0){
//             const savedDataPromises = formattedData.map(async (data) => {
//                 const newData = new Data(data);
//                 await newData.save();
//             });
    
//             await Promise.all(savedDataPromises);
//             console.log(formattedData);
//             return res.json(formattedData);
//         }else{
//             console.log("No new data to save");
//             return res.json(formattedData);
//         }

//       } catch (error) {
//         console.error('Error fetching Favoriot data:', error);
//         res.status(500).json({ error: 'Failed to fetch Favoriot data' });
//       }
// }

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
        console.log("from getDataAyerKeroh, line 198 result:",result);

        const formattedData = result.map(item => ({
            celsius: parseFloat(item.data.celsius).toFixed(2),
            fahrenheit: parseFloat(item.data.fahrenheit).toFixed(2),
            humidity: parseFloat(item.data.humidity).toFixed(2),
            rain: item.data.rain, // Assuming rain data does not need formatting
            rainValue: parseFloat(item.data.rainValue).toFixed(2),
            distance: parseFloat(item.data.distance).toFixed(2),
            status: item.data.status
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
        console.log("from getDataDurianTunggal, line 266 result:",result);

        const formattedData = result.map(item => ({
            celsius: parseFloat(item.data.celsius).toFixed(2),
            fahrenheit: parseFloat(item.data.fahrenheit).toFixed(2),
            humidity: parseFloat(item.data.humidity).toFixed(2),
            rain: item.data.rain, // Assuming rain data does not need formatting
            rainValue: parseFloat(item.data.rainValue).toFixed(2),
            distance: parseFloat(item.data.distance).toFixed(2),
            status: item.data.status
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


//old version
// module.exports.renderingDataFavoriot = async(req,res)=>{
//     try{
//         const {id} = req.params;
    
//         // Set session variables
//         req.session.userid = id;
//         req.session.locationName = getLocationName(id);
//         // Check if location name is valid
//         if (!req.session.locationName) {
//             return res.status(400).json({ error: 'Invalid collection id' });
//         }
//         const data = saveData(req.session.userid, req.session.locationName);

//         const response = await axios.get('http://localhost:3000/iot/getData');
//         //const response = await axios.get('https://iotfloodberr.azurewebsites.net/iot/getData'); 

        
//         console.log(response.status);
//         if(response.status !== 200){
//             throw new Error('Failed to fetch Favoriot data');
//         }else{
//             console.log("Rendering Data from Favoriot IOT",response.data);
//             const favoriotData = response.data; // Assuming response.data is an array of objects
//             // Pass both data and timestamp to the template
//             const firstItem = favoriotData[0]; // Get the first item in the array
//             // Pass the first item to the template
//             res.render('iot/dashboard', { favoriotData:firstItem, data });
//         }
//     }catch(error){
//         console.error('Error fetching data from Favoriot', error);
//         res.status(500).json({error: 'Failed to fetch data from Favoriot'});
//     }
// }

//latest version
module.exports.renderingData = async(req,res)=>{
    try{
        const {id} = req.params;
    
        // Set session variables
        req.session.userid = id;
        req.session.locationName = getLocationName(id);
        // Check if location name is valid
        if (!req.session.locationName) {
            return res.status(400).json({ error: 'Invalid collection id' });
        }
        const data = saveData(req.session.userid, req.session.locationName);
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
        // if(data.id === 'duriantunggal'){
        //     response = await axios.get('http://localhost:3000/iot/getDurianTunggalData');
        //     //response = await axios.get('https://iotfloodberr.azurewebsites.net/iot/getDurianTunggalData'); 
        // }else if (data.id === 'ayerkeroh') {
        //     response = await axios.get('http://localhost:3000/iot/getAyerKerohData');
        //     //response = await axios.get('https://iotfloodberr.azurewebsites.net/iot/getAyerKerohData'); 
        // } else {
        //     throw new Error("Invalid location id");
        // }

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
    
    // Set session variables
    req.session.userid = id;
    req.session.locationName = getLocationName(id);
    // Check if location name is valid
    if (!req.session.locationName) {
        return res.status(400).json({ error: 'Invalid collection id' });
    }
    // Call the function to set default session values
    setDefaultSessionValues(req);
    // Prepare data object
    const data = saveData(req.session.userid, req.session.locationName);
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

module.exports.notificationDisplay =(req,res)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/notification',{data} );
}

module.exports.analysis=(req,res)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/analysis',{data})
}

module.exports.about =(req,res)=>{
    // Call the function to set default session values
    setDefaultSessionValues(req);
    const data = saveData(req.session.userid, req.session.locationName);
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
