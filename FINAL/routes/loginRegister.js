var express = require('express');
var router = express.Router();

/**
 * Get Login Page needs validation if already logged in 
 */
router.get('/', function(req, res, next) {
  res.render('login', {user:req.session.currentuser});
});

module.exports = router;
