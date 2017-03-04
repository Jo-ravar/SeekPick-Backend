var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
//var db = 'mongodb://localhost:27017/seekpick';
//mongoose.connect(db);
mongoose.connect("mongodb://seek:seek123@ds031832.mlab.com:31832/seekpick");
require('./src/utilities/passport')(passport);
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(passport.initialize());

var indexRoute=require('./src/routes/index');
app.use('/',indexRoute);

app.listen(app.get('port'),function(err) {
    if(!err)
    {
        console.log("server started at port 3000");
    }
});