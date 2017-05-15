var router = require('express').Router();
var dbhelper=require('../utilities/dbhelper');
var passport = require('passport');
var ObjectID=require('mongodb').ObjectID;  

router.route('/add')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
    if(!req.body.itemname||!req.body.itemprice||!req.body.tags||!req.body.status){
        res.json({ success: false, message: 'Please fill all details.' });
    }else{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var dateStr = dd+'/'+mm+'/'+yyyy;
        console.log("date is :-- "+dateStr);

        var user = req.user._id; 
        var db=dbhelper.db;
        var collection = db.collection('items');

       collection.insertOne({
            name:req.body.itemname,
            price:req.body.itemprice,
            tags:req.body.tags,
            status:req.body.status,
            lastUpdate:dateStr,
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
     if(!req.body.itemname||!req.body.itemprice||!req.body.tags||!req.query.id||!req.body.status){
         res.json({ success: false, message: 'Please edit all details.' });
     }
     else{
       var user = req.user._id; 

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var dateStr = dd+'/'+mm+'/'+yyyy;
        console.log("date is :-- "+dateStr);

            var newData = {
            name:req.body.itemname,
            price:req.body.itemprice,
            tags:req.body.tags,
            status:req.body.status,
            lastUpdate:dateStr,
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

router.route('/status')
.post(passport.authenticate('jwt', { session: false }),function(req,res){
if(!req.body.itemname ||!req.body.ans)
    {
        res.json({ success: false, message: 'Please specify object name and its status' });
    }
 else{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var dateStr = dd+'/'+mm+'/'+yyyy;
       console.log("name and ans :-- "+req.body.itemname+" "+req.body.ans);
        var user = req.user._id; 
        var db=dbhelper.db;
        var collection = db.collection('items');
        collection.update({shopkeeper:user,name:req.body.itemname},{$set:{status:req.body.ans, lastUpdate:dateStr}},function(err,results){
             if(err)
            {
                console.log("Error in editing " + JSON.stringify(err));
                 return res.json({ success: false, message: 'Something went wrong.'});
            }
       else{
           if(results.result.nModified==0)
           { res.send({ success: true, message: 'SORRY,you are logged in with different shop enquiry of only logged in shop can be updated. ' });}
            else{
                res.send({ success: true, message: ' successfully updated status.' });
              }
         }
        });
   }
});

module.exports = router;