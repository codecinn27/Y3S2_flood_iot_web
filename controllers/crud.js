const Data = require('../models/data');
//used for favoriot
var request = require("request");
const axios = require("axios");

//format timestamp into this form 29/4/24, 11:40:51 PM 
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100; // Getting last two digits of the year
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${day}/${month}/${year}, ${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${meridian}`;
    return formattedTime;
};

const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds


//create
module.exports.inputPage = (req,res)=>{
    res.render('crud/input');
}

module.exports.createNewData = async(req,res,next)=>{
    // Extract title and price from request body
    const { 'data[title]': title, 'data[price]': price } = req.body;
    //console.log("data received",req.body);
    const data1 = new Data({ title, price });
    await data1.save();
    console.log("data saved: ", data1);
    //req.flash('success', 'Successfully upload a new data');
    res.redirect(`/`);
}

//read
module.exports.readAllData = async(req,res)=>{
    const AllData = await Data.find({});
    res.render('crud/allData',{AllData});
}

//res render
module.exports.readDataFavoriot = async(req,res)=>{
    var options = { method: 'GET',
        url: 'https://apiv2.favoriot.com/v2/streams?device_developer_id=dht11_test_1_device@iiotsme&max=2&order=DESC',
        headers: 
        { 'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imlpb3RzbWUiLCJyZWFkX3dyaXRlIjp0cnVlLCJpYXQiOjE3MTMyMzA0NTh9.NAgZ2-4KxSZjwGKr-CWKPc8ZMEMDikqVh5rHO_wOMOM' } 
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const parsedBody = JSON.parse(body);
    const results = parsedBody.results;

    let formattedResults = '';

    results.forEach(result => {
        formattedResults += `Timestamp: ${formatTimestamp(result.timestamp)}\n`;
        formattedResults += `Data: ${JSON.stringify(result.data)}\n`;
        formattedResults += '\n'; // Add spacing between each result
    });
    console.log(formattedResults);
    /*res.send() function in Express does not interpret 
    newline characters (\n) by default. */
    res.render('crud/favoriot', {formattedResults})
    });
    
}


module.exports.getDataFavoriot = async(req,res)=>{
    try {
        const response = await axios.get('https://apiv2.favoriot.com/v2/streams?device_developer_id=dht11_test_1_device@iiotsme&max=1&order=DESC', {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': 'RwxZ3MgXBcW1hB7iIeORFkdyBO3PsZ2n'
          }
        });
        //console.log("response: ",response);
        const result = response.data.results;
        //console.log("result",result);
        const formattedData = result.map(item => ({
            data: item.data,
            timestamp: formatTimestamp(item.timestamp),
        }));
        
        //console.log(formattedData);
        res.json(formattedData);
      } catch (error) {
        console.error('Error fetching Favoriot data:', error);
        res.status(500).json({ error: 'Failed to fetch Favoriot data' });
      }
}

//testing to send data and display just one data
module.exports.renderingDataFavoriot = async(req,res)=>{
    try{
        const response = await axios.get('http://localhost:3000/crud/getDataFavoriot');
        console.log(response.status);
        if(response.status !== 200){
            throw new Error('Failed to fetch Favoriot data');
        }else{
            console.log("Rendering Data from Favoriot IOT",response.data);
            const favoriotData = response.data; // Assuming response.data is an array of objects
            // Pass both data and timestamp to the template
            const firstItem = favoriotData[0]; // Get the first item in the array
            // Pass the first item to the template
            res.render('crud/favoriot2', { favoriotData:firstItem });
        }
    }catch(error){
        console.error('Error fetching data from Favoriot', error);
        res.status(500).json({error: 'Failed to fetch data from Favoriot'});
    }
}



//https://www.simform.com/blog/build-real-time-apps-node-js/