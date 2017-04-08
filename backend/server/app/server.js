// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser'); //parse incoming POST body
var MongoClient = require('mongodb').MongoClient; //mongo database
var request = require('request'); //make http requests
var xpath = require('xpath');  //xpath parser
var dom = require('xmldom').DOMParser; //dom obj for xpath

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var db;
MongoClient.connect('mongodb://thurman:justice@ds021343.mlab.com:21343/atpfinder', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/logUserSearch', function(req, res) {
    console.log(req.body);
    db.collection('usersearches').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })  
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/craigslist', function(req, res) {

request('http://DENVER.craigslist.org/search/sss?format=rss&query=chair', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var doc = new dom().parseFromString(body)
        var select = xpath.useNamespaces(
            {"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
             "enc" : "http://purl.oclc.org/net/rss_2.0/enc#",
             "dc" : "http://purl.org/dc/elements/1.1/"
            });
        
        var nodes = select('//*[name()="item"]' , doc);
        
        var responseModels = []
        for(i in nodes){
        var responseModel = {};
         var item = new dom().parseFromString(nodes[i].toString())
        
        var titleNode = select('//*[name()="title"]/text()' , item);
        var title = titleNode[0].toString();
       title = title.substring(title.lastIndexOf('<![CDATA')+9, title.lastIndexOf(']]>'))
        responseModel['title'] = title;
        responseModels.push(responseModel);
        }
        
        res.json({"response" : responseModels})
     }
})
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);