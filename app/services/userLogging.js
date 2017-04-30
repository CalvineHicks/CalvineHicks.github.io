var express    = require('express');
var router = express.Router();
var request = require('request');

router.post('/logUserSearch', function(req, res) {
    console.log(req.body);
    db.collection('usersearches').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

module.exports = router;