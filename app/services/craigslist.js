var express    = require('express');
var router = express.Router();
var request = require('request');
var xpath = require('xpath');  //xpath parser
var dom = require('xmldom').DOMParser; //dom obj for xpath

router.get('/craigslist', function(req, res) {
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
        responseModel['price'] = price;

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

module.exports = router;