// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var router = express.Router();
var app        = express();                 // define our app using express
var request = require('request'); //make http requests
var bodyParser = require('body-parser'); //parse incoming POST body
var MongoClient = require('mongodb').MongoClient; //mongo database
var properties = require('./properties.js');
var path = require('path');
var xpath = require('xpath');  //xpath parser
var dom = require('xmldom').DOMParser; //dom obj for xpath
var json2csv = require('json2csv');

// CORS header securiy
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
    // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
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
    
    //get any existing entry with this IP
    db.collection('usersearches').findOne({'ipAddress' : ip}, (err, result) => {

            var visit = {};
            var visits;
        //if no result then this is the first time this IP has clicked a link
        //create a new user object for them
        if(!result){
            //set up new user obj
            var user = {};
            visits = [];
            user['ipAddress'] = req.body['ipAddress'];
            user['ipCity'] = req.body['ipCity'];
            user['ipCountry'] = req.body['ipCountry'];
            user['ipState'] = req.body['ipState'];
            user['visits'] = visits;
        }
        //if we get a result then this user has clicked a link before
        //add this cilck to the list of visits
        else{
            var user = result;
            visits = user['visits'];
        }
        
        //create a new visit object to store this visits information
        //user entered zip may vary from their IP so log it separately
        visit['reasonForSearch'] = req.body['reasonForSearch'];
        visit['areaOfNeed'] = req.body['areaOfNeed'];
        visit['typeOfATDevice'] = req.body['typeOfATDevice'];
        visit['userZip'] = req.body['userZip'];
        visit['userCity'] = req.body['userCity'];
        visit['userState'] = req.body['userState'];
        
        visit['clickedLink'] = req.body['clickedLink'];
        visit['date'] = today;
        visits.push(visit);
        
        //store in mongo
        db.collection('usersearches').save(user, (err, result) => {
            if (err) return console.log(err);
          });
    });
            res.json('success');
});

app.get('/getUserSearchReport', function(req, res) {
    var fields = ['ipAddress', 'ipCity', 'ipState', 'ipCountry', 'userZip', 'userCity', 'userState', 'date', 'clickedLink','reasonForSearch','areaOfNeed','typeOfATDevice'];
    var fieldNames = ['IP Address', 'IP Addr. City', 'IP Addr. State', 'IP Addr. Country', 'User Entered Zip Code', 'User Entered City', 'User Entered State', 'Date of Visit', 'Clicked Link', 'Reason For Search', 'Area Of Need', 'Type Of AT Device'];

    db.collection('usersearches').find().toArray(function(err, docs) {
        var results = [];
        for(var i in docs){
            var visits = docs[i]['visits'];
            for(var j in visits){
                var result = {};
                result['ipAddress'] = docs[i]['ipAddress'];
                result['ipCity'] = docs[i]['ipCity'];
                result['ipState'] = docs[i]['ipState'];
                result['ipCountry'] = docs[i]['ipCountry'];
                result['userZip'] = visits[j]['userZip'];
                result['userCity'] = visits[j]['userCity'];
                result['userState'] = visits[j]['userState'];
                result['date'] = visits[j]['date'];
                result['clickedLink'] = visits[j]['clickedLink'];
                result['reasonForSearch'] = visits[j]['reasonForSearch'];
                result['areaOfNeed'] = visits[j]['areaOfNeed'];
                result['typeOfATDevice'] = visits[j]['typeOfATDevice'];
                results.push(result);
            }
        }
        var data = json2csv({ data: results, fields: fields, fieldNames: fieldNames });
        res.attachment('ATFinderUserReport.csv');
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

app.get('/craigslist', function(req, res) {
var city = req.query.city.toUpperCase();
var queryString = req.query.queryString;
request('http://'+city+'.craigslist.org/search/sss?format=rss&query='+queryString+'', function (error, response, body) {
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
        title = title.substring(title.lastIndexOf('<![CDATA')+9, title.lastIndexOf(']]>')).replace('&#x0024;','$');
        //replace takes 'A SAMPLE SENTENCE' and makes it 'A Sample Sentence', or 'a sample sentence' to 'A Sample Sentence'
        responseModel['title'] = title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        var price = title.substring(title.lastIndexOf('$', title.length));
        price = parseInt(price.replace('$',''), 10);
        if(isNaN(price)){
            responseModel['price'] = 'Price Not Available';
        }
        else{
            responseModel['price'] = price;
        }

        var link = select('//*[name()="link"]/text()' , item)[0].toString();
        responseModel['link'] = link;

        var description = select('//*[name()="description"]/text()' , item)[0].toString();
        description = description.substring(description.lastIndexOf('<![CDATA')+9, description.lastIndexOf(']]>'));
        responseModel['description'] = description;

        var date = select('//*[name()="dc:date"]/text()' , item)[0].toString();
        responseModel['startDateTime'] = date;

        var resourceType =  select('//*[name()="enc:enclosure"]/@type' , item);

        if(resourceType[0] != null && resourceType[0] != undefined){
            if(resourceType[0].value == 'image/jpeg'){
                var imageLink = select('//*[name()="enc:enclosure"]/@resource' , item)[0].value;
                responseModel['imageLink'] = imageLink;
            }
        }


        responseModels.push(responseModel);
        }

        res.json(responseModels)
     }
})
});

app.get('/ebay', function(req, res) {
var queryString = req.query.queryString;
    request('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME='+properties.ebay.app_name+'&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+queryString+'&paginationInput.entriesPerPage=100&GLOBAL-ID=EBAY-US&siteid=0', function (error, response, body) {
        var resultList = [];

        body = JSON.parse(body);


        var ebayRes = body['findItemsByKeywordsResponse'][0];

        if(ebayRes['ack'] == 'Success'){
            var searchResults = ebayRes['searchResult'];
            if(searchResults[0]){
                var items = searchResults[0]['item'];
                if(items){
                    for(i in items){
                        var result = {};
                        //replace takes 'A SAMPLE SENTENCE' and makes it 'A Sample Sentence', or 'a sample sentence' to 'A Sample Sentence'
                        result['title'] = items[i]['title'][0].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                        result['price'] = items[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
                        result['price'] = Number(result['price']);
                        //TODO add exception handling to each field, if field not found give default value
                        try {
                            result['shippingPrice'] = items[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];
                        }
                        catch (err){ result['shippingPrice'] = 'No Shipping Info Available' }
                        result['link'] = items[i]['viewItemURL'][0];
                        try {
                        result['description'] = items[i]['subtitle'][0];
                        }
                        catch (err){ result['description'] = 'No Description Available' }
                        try{
                            result['thumbnail'] = items[i]['galleryURL'][0];
                        }
                        catch (err){}
                        try {
                            result['imageLink'] = items[i]['galleryPlusPictureURL'][0];
                        }
                        catch (err){}
                        result['startDateTime'] = items[i]['listingInfo'][0]['startTime'][0]
                        result['endDateTime'] = items[i]['listingInfo'][0]['endTime'][0]

                        resultList.push(result);
                    }
                }
            }
        }

        res.json(resultList);
    });
});

app.get('/walmart', function(req, res) {
    var queryString = req.query.queryString;
    var sort = req.query.sort;
    var order = req.query.order;
    var endpoint = 'http://api.walmartlabs.com/v1/search?apiKey='+properties.walmart.app_key+'&query='+queryString+'&categoryId=976760';
    var pageNum = req.query.pageNum;
    if(sort){
        endpoint = endpoint + '&sort='+sort+'&order='+order;
    }

    request(endpoint+'&numItems=25&start='+pageNum , function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            var responseModels = [];
            var items = body['items'];
            for(i in items){
                var responseModel = {};
                var item = items[i];

                responseModel['itemID'] = item['itemId'];
                responseModel['title'] = item['name'];
                responseModel['price'] = item['salePrice'] ? item['salePrice'] : item['msrp'];

                responseModel['shippingPrice'] = item['standardShipRate'];
                responseModel['link'] = item['productUrl'];
                responseModel['description'] = item['shortDescription'];
                responseModel['thumbnail'] = item['thumbnailImage'];
                responseModel['imageLink'] = item['mediumImage'];
                responseModel['startDateTime'] = '';

                responseModels.push(responseModel);
            }
            res.json(responseModels);
         }
         else {
            console.log(body);
            res.json(responseModels);
         }
    });


});

app.get('/getZip', function(req, res) {
     request('http://maps.googleapis.com/maps/api/geocode/json?address='+req.query.zipCode+'&sensor=false', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            var result = results['results'][0];
            if(result != null){
                    var response = {};
                for(i in result['address_components']){
                    var addr = result['address_components'][i];
                    if(addr['types']){
                        if(addr['types'].indexOf('locality')>-1 || addr['types'].indexOf('postal_town')>-1){
                           response['city'] = addr['long_name'];
                        }
                        if(addr['types'].indexOf('administrative_area_level_1')>-1){
                            response['state'] = addr['short_name'];
                        }
                        if(addr['types'].indexOf('country')>-1){
                            response['country'] = addr['short_name'];
                        }
                    }
                }
                res.json(response);
            }
        }
    });
});
// START THE SERVER
// =============================================================================
app.listen(port);
// =============================================================================