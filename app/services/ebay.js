var express    = require('express');
var router = express.Router();
var request = require('request');
var properties = require('../properties.js');

router.get('/ebay', function(req, res) {
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
                        result['thumbnail'] = items[i]['galleryURL'][0];
                        try {
                            result['imageLink'] = items[i]['galleryPlusPictureURL'][0];
                        }
                        catch (err){ result['imageLink'] = 'No Image Link Available' }
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

module.exports = router;