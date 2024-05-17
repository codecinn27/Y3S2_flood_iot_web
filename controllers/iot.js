const axios = require("axios");
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

const saveData = (id,location)=>{
    const data = {
        id: id,
        locationName: location
    };
    return data;
}


module.exports.dashboardPage = (req,res)=>{
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
module.exports.getDataFavoriot = async(req,res)=>{
    try {
        const response = await axios.get('https://apiv2.favoriot.com/v2/streams?device_developer_id=dht11_test_1_device@iiotsme&max=1&order=DESC', {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': process.env.FAVORIOT_API_KEY
          }
        });
        //console.log("response: ",response);
        const result = response.data.results;
        const formattedData = result.map(item => ({
            data: item.data
        }));

        console.log(formattedData);
        res.json(formattedData);
      } catch (error) {
        console.error('Error fetching Favoriot data:', error);
        res.status(500).json({ error: 'Failed to fetch Favoriot data' });
      }
}

module.exports.renderingDataFavoriot = async(req,res)=>{
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

        //const response = await axios.get('http://localhost:3000/iot/getData');
        const response = await axios.get('https://iotfloodberr.azurewebsites.net/iot/getData'); 
        console.log(response.status);
        if(response.status !== 200){
            throw new Error('Failed to fetch Favoriot data');
        }else{
            console.log("Rendering Data from Favoriot IOT",response.data);
            const favoriotData = response.data; // Assuming response.data is an array of objects
            // Pass both data and timestamp to the template
            const firstItem = favoriotData[0]; // Get the first item in the array
            // Pass the first item to the template
            res.render('iot/dashboard', { favoriotData:firstItem, data });
        }
    }catch(error){
        console.error('Error fetching data from Favoriot', error);
        res.status(500).json({error: 'Failed to fetch data from Favoriot'});
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
    // Prepare data object
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/datalog',  { data}); 
}

module.exports.notificationDisplay =(req,res)=>{
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/notification',{data} );
}

module.exports.about =(req,res)=>{
    const data = saveData(req.session.userid, req.session.locationName);
    res.render('iot/about', {data});
}

