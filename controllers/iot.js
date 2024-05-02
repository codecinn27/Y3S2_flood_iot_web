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