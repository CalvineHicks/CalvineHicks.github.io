var express    = require('express');
var router = express.Router();
var request = require('request');
var properties = require('../properties.js');

router.get('/walmart', function(req, res) {
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

                responseModel['title'] = item['name'];
                responseModel['price'] = item['msrp'] ? item['msrp'] : item['salePrice'];

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

module.exports = router;