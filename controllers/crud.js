const Data = require('../models/data');

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