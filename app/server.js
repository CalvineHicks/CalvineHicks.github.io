// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var request = require('request'); //make http requests
var bodyParser = require('body-parser'); //parse incoming POST body
var MongoClient = require('mongodb').MongoClient; //mongo database
var properties = require('./properties.js');
var path = require('path');

// CORS header securiy
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
    // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
        console.log(req.method);
          res.send(200);
        }
        else {
          next();
        }
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//mongodb connection for logging user link clicks + generating reports
var db;
MongoClient.connect('mongodb://'+ properties.mongodb.user_name +':'+properties.mongodb.password+'@'+properties.mongodb.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  //Path to your main file
  res.status(200).sendFile(path.join(__dirname+'/public/index.html'));
});

app.use(require('./services/craigslist'));
app.use(require('./services/ebay'));
app.use(require('./services/zipLookup'));
app.use(require('./services/userLogging'));

// START THE SERVER
// =============================================================================
app.listen(port);
// =============================================================================