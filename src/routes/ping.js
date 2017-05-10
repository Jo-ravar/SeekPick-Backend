var router = require('express').Router();
var request = require('request');
var User = require('../models/users'); 

router.route('/')
.post(function(req,res){
  var shop=req.body.shopId;
  var objName=req.body.name;
  var mssg="A customer wants to know that is "+objName+" currently available in your shop ?"
  var query={_id:shop};
  var device="";
    User.find(query,function(err,result){
       if (err) {
                    console.error(JSON.stringify(err));
                }
                else {
                      console.log(" USer data send"+result);
                      device=result[0].registerId;
                      console.log("Device is:-- "+device);
                      request({
                 url: 'https://fcm.googleapis.com/fcm/send',
                 method: 'POST',
                 headers: {
                     'Content-Type' :' application/json',
                    'Authorization': 'key=AIzaSyDQelCUdcvHt_JidbEgcRmiws6taxS0RVY'
                         },
                 body: JSON.stringify(
                      {   data : {
                          title : 'SeekPick',
                          body : mssg
                    },
                  "to" : device
                    }
                 )}, function(error, response, body) {
                  if (error) { 
                 console.error(error, response, body); 
                 }
                else if (response.statusCode >= 400) { 
               console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
               }
              else {
                console.log('Done!');
                res.send("Donnnnneee");
            }
        });
      }
    });
});



module.exports = router;