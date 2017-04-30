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

router.use(require('./services/craigslist'));
router.use(require('./services/ebay'));
router.use(require('./services/zipLookup'));
router.use(require('./services/userLogging'));
router.use(require('./services/atpFinderApp'));


app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  //Path to your main file
  res.status(200).sendFile(path.join(__dirname+'../public/index.html'));
});

// START THE SERVER
// =============================================================================
app.listen(port);
// =============================================================================