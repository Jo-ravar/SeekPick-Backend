var router = require('express').Router();
var dbhelper=require('../utilities/dbhelper');
var User = require('../models/users');
var passport = require('passport');
var ObjectID=require('mongodb').ObjectID;  

router.route('/')
.post(function(req,res){
  var searchData=req.query.id;
  var db =dbhelper.db;
  var collection = db.collection('items');
  collection.ensureIndex({
  name:"text",      
  tags: "text"
},{weights: {name: 20}});
var Rangess=0;
if(!req.body.range)
Rangess=100;
else
Rangess=parseFloat(req.body.range);

 var ids=new Array();
var lat =parseFloat(req.body.lat);
var long=parseFloat(req.body.long); 

 User.find({ loc: { $near: {'$maxDistance':Rangess*1000, '$geometry': { type: 'Point', coordinates: [ lat, long ] }} }},function(err,data, stats){
if(err)
console.log("ERROR:---- "+ JSON.stringify(err)+" ");
else
{ console.log("DATA:----- "+data);
  ids=shopkeeper_id(data);
  console.log("IDS:---- "+ids);
     collection.aggregate([  
                 
              { 
                  $match: 
                  {   shopkeeper:{$in:ids},
                      $text: {$search: searchData},
                  } 
             },
              { $sort: { score: { $meta: "textScore" } } },
               
              {
                  $lookup:
                  {
                       from:"users",
                       localField:"shopkeeper",
                       foreignField:"_id",
                       as:"shopkeeper_docs"   
                  }
              },
              { 
                  $project : 
                  { 
                      "name":1,
                      "price":1,
                      "tags":1,
                      "shopkeeper":1,
                    "shopkeeper_docs._id":1,
                     "shopkeeper_docs.location":1,
                     "shopkeeper_docs.name":1,
                     "shopkeeper_docs.pincode":1,
                     "shopkeeper_docs.phone":1,
                     "shopkeeper_docs.loc":1,
                     score:1
                  } 
              }                
],function(err,data){
    if(err)
       {
                console.error(JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
       }
       else{
           res.send(data);
       }
    });
   }
 });
});

router.route('/nearby')
.post(function(req,res){
var Rangess=0;
if(!req.body.range)
Rangess=5;
else
Rangess=parseFloat(req.body.range);

var lat =parseFloat(req.body.lat);
var long=parseFloat(req.body.long);
 User.find({ loc: { $near: {'$maxDistance':Rangess*1000, '$geometry': { type: 'Point', coordinates: [ lat, long ] }} }},{username:0,password:0}
 ,function(err,data, stats){
if(err)
console.log("ERROR:---- "+ JSON.stringify(err)+" ");
else
{ console.log("DATA:----- "+data);
  res.send(data);
}
 });
});

router.route('/allproduct')
.post(function(req,res){
 if(!req.query.id)
    {
        res.json({ success: false, message: 'Please specify shopkeeper id' });
    }
 else
 {
         var user = req.query.id;
         console.log(" userid "+user)
         var objectId = new ObjectID(user);
         console.log("object "+objectId);
         var db =dbhelper.db;
         var collection = db.collection('items');
         collection.find({shopkeeper:objectId}).toArray(function(err,data){
            if(err)
            {
                 console.error(JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
            }
            else
            {
                console.log("ALLitems "+JSON.stringify(data));
                res.send(data);
            }
         });
 }   

});

function shopkeeper_id(data){
    var allid= new Array();
    for(var i=0; i<data.length; i++ )
    {
        allid[i]=data[i]._id;
    }

    return allid;
}

module.exports = router;