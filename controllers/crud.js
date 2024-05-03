const Data = require('../models/data');
var request = require("request");



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

//update

//delete


module.exports.readDataFavoriot = async(req,res)=>{
    var options = { method: 'GET',
        url: 'https://apiv2.favoriot.com/v2/streams?max=10&order=asc',
        headers: 
        { 'cache-control': 'no-cache',
            'content-type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imlpb3RzbWUiLCJyZWFkX3dyaXRlIjp0cnVlLCJpYXQiOjE3MTMyMzA0NTh9.NAgZ2-4KxSZjwGKr-CWKPc8ZMEMDikqVh5rHO_wOMOM' } 
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    res.send(body);
    });
    
}