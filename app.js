var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./src/utilities/config');
//var db = 'mongodb://localhost:27017/seekpick';
//mongoose.connect(db);
mongoose.connect(config.db);
require('./src/utilities/passport')(passport);
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(passport.initialize());

var indexRoute=require('./src/routes/index');
var itemRoute=require('./src/routes/item'); 
var searchRoute=require('./src/routes/search');
var pingRoute=require('./src/routes/ping');

app.use('/',indexRoute);
app.use('/item',itemRoute);
app.use('/search',searchRoute);
app.use('/ping',pingRoute);

app.listen(app.get('port'),function(err) {
    if(!err)
    {
        console.log("server started at port 3000");
    }
});