import mongoose from "mongoose";
import autoIncrement from "mongoose-sequence";

const AutoIncrement = autoIncrement(mongoose)

const userSchema = mongoose.Schema({
  module: String,
  name: String,
  password: String,
  email: String,
  address:String,
  mobile:Number,
  country:String,
  state:String,
  createdAt: { type: Date, default: new Date() },
  user_id:{type:Number},
  friendsList:{type:Array}
})
userSchema.plugin(AutoIncrement,{ inc_field: "user_id",id:"_id" })

const UserSchema = mongoose.model('00_users', userSchema)

export default UserSchema;