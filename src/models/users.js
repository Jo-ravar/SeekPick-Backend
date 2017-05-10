var mongoose = require('mongoose');
var email =require('mongoose-type-email');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  username:{
      type: String,
      required:true,
      unique:true
  },
  password: {
    type: String,
    required: true
  },
  name:String,
  phone:Number,
  pincode:Number,
  location:{
      type:String,
      required:true
  },
  registerId:{
      type: String,
      required:true,
      unique:true
  },
   loc: {
    type: {
      type: "String",
      required: true,
      enum: ['Point', 'LineString', 'Polygon'],
      default: 'Point'
    },
    coordinates: [Number]
  }
});

UserSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);