var router = require('express').Router();
var dbhelper=require('../utilities/dbhelper');
var passport = require('passport');
var ObjectID=require('mongodb').ObjectID;  

router.route('/add')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
    if(!req.body.itemname||!req.body.itemprice||!req.body.tags){
        res.json({ success: false, message: 'Please fill all details.' });
    }else{
       
        var user = req.user._id; 
        var db=dbhelper.db;
        var collection = db.collection('items');
       collection.insertOne({
            name:req.body.itemname,
            price:req.body.itemprice,
            tags:req.body.tags,
            shopkeeper:user
        }, function (err, result) {
            if (err) {
                console.log("Error in insert " + JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
               
            } else {
                console.log("Insert Successful " + JSON.stringify(result));
                 res.json({ success: true, message: 'Successfully Added' });
            }
        });

    }
});

router.route('/edit')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
     if(!req.body.itemname||!req.body.itemprice||!req.body.tags||!req.query.id){
         res.json({ success: false, message: 'Please edit all details.' });
     }
     else{
            var user = req.user._id; 

            var newData = {
            name:req.body.itemname,
            price:req.body.itemprice,
            tags:req.body.tags,
            shopkeeper:user
        }
        var id=req.query.id;
       var objectId = new ObjectID(id);
       console.log(" id "+id);
       var query= {_id:objectId};
        var db=dbhelper.db;
        var collection = db.collection('items');
        
        collection.update( query,newData, { upsert: true },function(err,result){
          if(err)
            {
                console.log("Error in editing " + JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
            }
       else{
            res.send({ success: true, message: ' successfully Edited.' });
         }
      });
     } 
});

router.route('/delete')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
    if(!req.query.id)
    {
        res.json({ success: false, message: 'Please specify item id' });
    }
    else{ 
         var id=req.query.id;
         console.log(" id "+id);
         var db =dbhelper.db;
         var collection = db.collection('items');
         var objectId = new ObjectID(id);
          collection.remove({ _id: objectId},function(err ,data){
             if(err)
             {
                 console.error(JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
             }
             else
             {
                 console.log(data);
                 res.json({ success: true, message: 'Successfully Deleted' });
             }
        });
      }
});

router.route('/myproducts')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
        
         var user =req.user._id; 
         console.log(" userid "+user)
         var db =dbhelper.db;
         var objectId = new ObjectID(user);
         console.log("object "+objectId);
         var collection = db.collection('items');
         collection.find({shopkeeper:user}).toArray(function(err,data){
            if(err)
            {
                 console.error(JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
            }
            else
            {
                console.log("Myitems "+JSON.stringify(data));
                res.send(data);
            }
         });
});




module.exports = router;