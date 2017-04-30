var express    = require('express');
var router = express.Router();
var request = require('request');

router.get('/getZip', function(req, res) {
     request('http://maps.googleapis.com/maps/api/geocode/json?address='+req.query.zipCode+'&sensor=false', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            var result = results['results'][0];
            if(result != null){
                    var response = {};
                for(i in result['address_components']){
                    var addr = result['address_components'][i];
                    console.log(addr);
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

module.exports = router;