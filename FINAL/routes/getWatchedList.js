var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    db.collection('watched').find().toArray(function(err, result) {
        if (err) throw err;
        res.json({
            allWatchedList:result,
            });
        });
});

module.exports = router;
