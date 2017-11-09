const express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config/database'),
    path = require('path'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    authentication = require('./routes/authentication')(router);

const cors = require('cors');

// const cors = require('cors');



/*  *** --Connect to Mongoose-- */
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err)
        console.log('Could not Connect to database', err);
    else{
        console.log('Connected to database: ', config.db);
    }
        
});
/*  *** --End-Connect to Mongoose-- */

    
/*  *** --SET UP MIDDLEWARE-- *** */
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);


//  set up cors for cross origin connecton  




//  connect to angular2 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/dist/index.html'));        
});
/*  *** --END-SET UP Connection to the client-- *** */



app.listen(8080, () => {
    console.log('Listening on port 8080');
});