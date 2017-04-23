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

//ebay username = ATPFinder
//ebay pass = ATPFinder21!
router.get('/ebay', function(req, res) {

    request('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=ThurmanJ-ATPFinde-PRD-f69e2c47f-507095d2&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=iPhone&paginationInput.entriesPerPage=10&GLOBAL-ID=EBAY-US&siteid=0', function (error, response, body) {
       res.json(JSON.parse(body));
    });
});
           
router.get('/getZip', function(req, res) {
    console.log('getZip');
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
        
        var title = select('//*[name()="title"]/text()' , item)[0].toString();
        title = title.substring(title.lastIndexOf('<![CDATA')+9, title.lastIndexOf(']]>'))
        responseModel['title'] = title;
            
        var link = select('//*[name()="link"]/text()' , item)[0].toString();
        responseModel['link'] = link;
            
        var description = select('//*[name()="description"]/text()' , item)[0].toString();
        description = description.substring(description.lastIndexOf('<![CDATA')+9, description.lastIndexOf(']]>'));
        responseModel['description'] = description;
            
        var date = select('//*[name()="dc:date"]/text()' , item)[0].toString();
        responseModel['date'] = date;
        
        var resourceType =  select('//*[name()="enc:enclosure"]/@type' , item);
        
        if(resourceType[0] != null && resourceType[0] != undefined){
            if(resourceType[0].value == 'image/jpeg'){
                var imageLink = select('//*[name()="enc:enclosure"]/@resource' , item)[0].value;
                responseModel['imageLink'] = imageLink;
            }
        }
        
        
        responseModels.push(responseModel);
        }
        
        res.json({"response" : responseModels})
     }
})
});

var getCityFromZip = function(zipCode){
    
    request('http://maps.googleapis.com/maps/api/geocode/json?address='+zipCode+'&sensor=false', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
    
}

function unicodeToChar(text) {
   return text.replace(/\\u[\dA-F]{4}/gi, 
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);