global.__droot__ = process.cwd();

var express = require('express');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var app = express();


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

var compression = require('compression');
var methodOverride = require('method-override');



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ extended: true, limit:'50mb' }));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));




//SISSCore Lite :D
global.SISSCore = require("./sisslite/sisscore")(app);

//Router mapper
var routes = require("./routes/index");

//MWS for project
var mws  =  require("./mws/index");
app.mws = new mws();

//CROSS HEADERS
app.use(SISSCore.cross);

//load mapper and do magick
SISSCore.Caronte.routeMapper(__dirname + '/routes', app);

app.listen(appEnv.port, function() {
    console.log("server starting on " + appEnv.url);
});