var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firtsName:String,
    lastName:String,
    email:{
        type: String,
        unique: true,
        match: /.+\@.+\..+/,
        required: [true, "Email required"]
    },
    password:String,
    role:String
},{collection:'users'})

userSchema.pre('save', function (next){
    if (this.isNew || this.isModified('password')) {
      bcrypt.hash(this.password, 10,
      (err, hashedPassword) => {
        if (err)
         next(err);
        else {
         this.password = hashedPassword;
         next();
        }
      });
    }
  })

var Users = mongoose.model('Users',userSchema)

module.exports = Users;