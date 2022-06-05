var express = require('express');
var router = express.Router();

/* Add Username and movie/show ID */
router.get('/', function(req, res, next) {

    var username = { quote: req.body.username };
    var name = { quote: req.body.name };
    var id = { quote: req.body.id };
    
    ```Requests that we'll need later 
        -username to attach the watched list with the right user(can be added later lets get just adding working)
        -name name of the movie/show
        -id id of movie/show to recall the api if user want to click the watched list and go to info page 
    ```

    //needs to be changed as it just adds the entire body of request
    db.collection('watched').save(req.body, function(err, result) {
        if (err) throw err;
        console.log('saved to database')
        res.redirect('/')
        })
});

module.exports = router;
