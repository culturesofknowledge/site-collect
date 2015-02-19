// BASE SETUP
// =============================================================================

config = require('./config/config.json')[process.env.NODE_ENV];
// call the packages we need
var express = require('express');
var db      = require('./model/db');
console.log("still in server");
var _       = require('underscore');
var path    = require('path')
//var favicon = require('static-favicon')
//var logger  = require('morgan')

var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser  = require('body-parser');
//var methodOverride = require('method-override');
var cookieParser= require('cookie-parser');
var app        = express();

// configure app
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon())
//app.use(logger('dev'))
app.use(bodyParser());
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded())
//app.use(require('method-override')())
app.use(cookieParser())
//app.use(session({ secret: 'keyboard cat', key: 'sid' }))

var confstore = {
 // db: {
    db: 'emlo-edit',
    //host: '192.168.1.111',
    //port: 6646,  // optional, default: 27017
    //username: 'admin', // optional
    //password: 'secret', // optional
    collection: 'mySessions' , // optional, default: sessions
 //}, 
  cookie_secret: '076ee61d63aa10a125ea872411e433b9'
};

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: confstore.cookie_secret,
  store: new MongoStore({
      url : config.dbURL,
    db : confstore.db
  })
}));
/**/

var port     = process.env.PORT || 3000; // set our port

// MODELS FOR OUR API
// =============================================================================

User   = require('./data/models/user');
Upload = require('./data/models/upload');
Person = require('./data/models/person');
Language = require('./data/models/language');
Place = require('./data/models/location');
Location = Place;
Institution = require('./data/models/institution');
console.log("server.js Institution: \n", Institution);
//User = require( 'mongoose' ).model('User');
Work = require('./data/models/work');
console.log("server.js Work: \n", Work);
Manifestation = require('./data/models/manifestation');

// ROUTES FOR OUR API
// =============================================================================

var user         = require('./routes/user');
var work         = require('./routes/work');
var admin_user   = require('./routes/admin/user');
var admin_upload = require('./routes/admin/upload');
var admin_person = require('./routes/admin/person');
var admin_place  = require('./routes/admin/place');
var admin_repo   = require('./routes/admin/repo');
var autocomplete = require('./routes/autocomplete');
var emloload     = require('./routes/emloload');
//var sandbox      = require('./routes/sandbox');
// REGISTER OUR ROUTES -------------------------------
app.use('/'             , user);
app.use('/user'         , user);
app.use('/work'         , work);
app.use('/admin/user'   , admin_user);
app.use('/admin/upload' , admin_upload);
app.use('/admin/person' , admin_person);
app.use('/admin/place'  , admin_place);
app.use('/admin/repo'   , admin_repo);
app.use('/autocomplete' , autocomplete);
app.use('/emloload'     , emloload);
//app.use('/sandbox'      , sandbox);

// catch 404 and forwarding to error handler
app.use(function(err, req, res, next) {
  console.log('Error(server.js) is happening method[%s] url[%s] path[%s] ', req.method, req.url, req.path);
  console.log("Request session: ==> ", req.session," req.route => ", req.route);
  console.log("Req.query: ==> ", req.query,"req.params => ", req.params,"body => ", req.body);
  //  var err = new Error('Not Found');
  //    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
