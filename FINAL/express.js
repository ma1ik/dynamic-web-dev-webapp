require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const expressSession = require('express-session');
const MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Router Imports
const  indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dataAddRouter = require('./routes/dataAdd');
const getWatchedListRouter = require('./routes/getWatchedList');
const loginRouter = require('./routes/loginRegister');
const apiRouter = require("./routes/api");

// Express Initialization
const expressApp = express();

// Set Express Config
expressApp.set('views', './templates');
expressApp.set('view engine', 'ejs');

// Connect to database and start express
let db;
MongoClient.connect(process.env.MONGO_URL, function (err, database) {
  if (err) throw err;
  db = database;
  expressApp.listen(3010);
  console.log("listening on 3010");
});

// Enable Sessions
expressApp.use(expressSession({secret: 'k3tchupP0pc0rnM0nk👁👄👁',resave:false,saveUninitialized:true}))

// Enable Logging
expressApp.use(logger('dev'));
// Enable JSON Body Parser
expressApp.use(express.json());
// Enable URL Encoded Parameter Parser
expressApp.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Enable Cookie Parser
expressApp.use(cookieParser());
// Add static files folder.
expressApp.use(express.static(path.join(__dirname, 'public')));

// Add Routers
expressApp.use('/', indexRouter );
expressApp.use('/users', usersRouter);
expressApp.use('/dataAdd', dataAddRouter);
expressApp.use('/login', loginRouter);
expressApp.use('/api', apiRouter);
expressApp.use('/getWatchedList', getWatchedListRouter);

/**
 * Get the page for the shows.
 */
expressApp.use('/showPage', function(req, res, next) {
    res.render('showPage', {user:req.session.currentuser});
});

expressApp.use('/info', function(req, res, next) {
  res.render('info', {user:req.session.currentuser});
});
/**
 * Get Profile viewing page
 */
expressApp.use('/profileMyList', function(req, res, next) {
  db.collection("likes").find({user: req.session.currentuser, type: "movie"}).toArray(function (err, movies) {
    db.collection("likes").find({user: req.session.currentuser, type: "tv"}).toArray(function (err, shows) {
      res.render('profileMyList', {user: req.session.currentuser, movies: movies || [], shows: shows || []});
      res.end();
    });
  });
});

expressApp.use('/felt_cute_might_delete_later', function(req, res, next) {
  if (req.session.currentuser) {
    if (!isNullUndefinedOrEmpty(req.body.type) && !isNullUndefinedOrEmpty(req.body.id)) {
      db.collection("likes").deleteOne({
        "user": req.session.currentuser,
        "id": req.body.id,
        "type": req.body.type
      }, function (err) {
        if (err) {
          res.write("false");
          res.end();
        } else {
          res.write("true");
          res.end();
        }
      });
    } else {
      res.write("false");
      res.end();
    }
  } else {
    res.write("false");
    res.end();
  }
});


expressApp.post("/doRegister", function (req, res) {
  //check we are logged in
  if (req.session.currentuser) {
    res.redirect("/");
    return;
  }

  //we create the data string from the form components that have been passed in
  var datatostore = {
    "username": req.body.username,
    "email": req.body.email,
    "password": req.body.password,
    "confpassword": req.body.confpassword
  };

  db.collection("people").findOne({$or: [{username: req.body.username},{email: req.body.email}]}, function (err, result)
  {
    if (err) {
      res.redirect("/login");
    } else {
      if (!result) {
        //once created we just run the data string against the database and all our new data will be saved/
        db.collection("people").save(datatostore, function (err, result) {
          if (err) throw err;
          console.log("saved to database");
          //when complete redirect to the index
          req.session.currentuser = req.body.username;
          res.redirect("/");
        });
      } else {
        res.redirect("/login");
      }
    }
  });
});

expressApp.post("/doLogin", function (req, res) {
  console.log("LOGING IN")
  console.log(JSON.stringify(req.body));
  var uname = req.body.username;
  var pword = req.body.password;

  db.collection("people").findOne({ $or: [{"username": uname}, {"email": uname}] }, function (err, result) {
    if (err) throw err;

    if (!result) {
      res.redirect("/login");
      return;
    }

    if (result.password === pword) {

      req.session.currentuser = result.username;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

function isNullUndefinedOrEmpty(value) {
  return value === null || value === undefined || value === "";
}

expressApp.post("/like", function (req, res) {
  console.log(req.body);
  if (!isNullUndefinedOrEmpty(req.session.currentuser)) {
    if (!isNullUndefinedOrEmpty(req.body.type) && !isNullUndefinedOrEmpty(req.body.id)) {
      db.collection("likes").findOne({type: req.body.type, image: req.body.image, title: req.body.title, id: req.body.id, user: req.session.currentuser}, function (err, result) {
        if (err) {
          res.write("false");
          res.end();
        }
        if (!result) {
          db.collection("likes").save({
            type: req.body.type,
            image: req.body.image,
            title: req.body.title,
            id: req.body.id,
            user: req.session.currentuser
          }, function (err) {
            if (err) {
              res.write("false");
              res.end();
            } else {
              res.write("true");
              res.end();
            }
          });
        } else {
          res.write("false");
          res.end();
        }
      });
    } else {
      res.end();
    }
  } else {
    res.write("false");
    res.end();
  }
});

expressApp.get("/logout", function (req, res) {
  req.session.currentuser = undefined;
  req.session.destroy();
  res.redirect("/");
});



module.exports = expressApp;
