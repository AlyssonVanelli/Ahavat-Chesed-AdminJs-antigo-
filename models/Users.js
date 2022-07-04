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

userSchema.pre("save", async function(next) {
  try {
      if (!this.isModified("password")) {
        return next();
      }
      let hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
  } catch (err) {
      return next(err);
 }
});

var Users = mongoose.model('Users',userSchema)

module.exports = Users;