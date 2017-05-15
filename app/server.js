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
var json2csv = require('json2csv');

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
app.use(bodyParser.json());

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
});

app.post('/logUserSearch', function(req, res) {
    var ip = req.body['ipAddress'];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;

    db.collection('usersearches').findOne({'ipAddress' : ip}, (err, result) => {

    console.log(result);
        if(!result){
            //set up new user obj
            var user = {};
            var visits = [];
            var visit = {};
            user['ipAddress'] = req.body['ipAddress'];
            user['city'] = req.body['city'];
            user['country'] = req.body['country'];
            user['state'] = req.body['state'];
            user['visits'] = visits;
        }
        else{
            var user = result;
            var visits = user['visits'];
            var visit = {};
        }

        visit['clickedLink'] = req.body['clickedLink'];
        visit['date'] = today;
        visits.push(visit);

        console.log(user);
        db.collection('usersearches').save(user, (err, result) => {
            if (err) return console.log(err);
          });
    });
            res.json('success');
});

app.get('/getUserSearchReport', function(req, res) {
    var fields = ['ipAddress', 'city', 'state', 'country', 'date', 'clickedLink'];
    var fieldNames = ['IP Address', 'City', 'State', 'Country', 'Date of Visit', 'Clicked Link'];

    db.collection('usersearches').find().toArray(function(err, docs) {
        var results = [];
        for(var i in docs){
            var visits = docs[i]['visits'];
            for(var j in visits){
                var result = {};
                result['ipAddress'] = docs[i]['ipAddress'];
                result['city'] = docs[i]['city'];
                result['state'] = docs[i]['state'];
                result['country'] = docs[i]['country'];
                result['date'] = visits[j]['date'];
                result['clickedLink'] = visits[j]['clickedLink'];
                results.push(result);
            }
        }
        var data = json2csv({ data: results, fields: fields, fieldNames: fieldNames });
        res.attachment('filename.csv');
        res.set('Content-Type', 'application/octet-stream');
        res.status(200).send(data);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  //Path to your main file
  res.status(200).sendFile(path.join(__dirname+'/public/index.html'));
});

app.use(require('./services/craigslist'));
app.use(require('./services/ebay'));
app.use(require('./services/walmart'));
app.use(require('./services/zipLookup'));

// START THE SERVER
// =============================================================================
app.listen(port);
// =============================================================================