const Data = require('../models/data');

//create
module.exports.createNewData = async(req,res,next)=>{

    const data = new Data(req.body.data);
    await data.save();
    console.log("data saved: ", data);
    //req.flash('success', 'Successfully upload a new data');
    res.redirect(`/`);
}

//read
module.exports.readAllData = async(req,res)=>{
    const AllData = await Data.find({});
    res.render('/crud/allData',{AllData});
}

//update

//delete