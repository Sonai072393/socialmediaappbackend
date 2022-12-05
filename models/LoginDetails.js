import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence'

import moment from 'moment';


const AutoIncrement = autoIncrement(mongoose)

const loginDetailsSchema = mongoose.Schema({
    module:String,
    user_id:Number,
    login_date:{type:Number,default:moment().unix() },
    logout_date:{type:Number},
    location: {type:Array},
    log_info_id:{type:Number}
})
loginDetailsSchema.plugin(AutoIncrement,{inc_field:"log_info_id",})

const LoginDetailsSchema = mongoose.model('01_log_info',loginDetailsSchema)

export default LoginDetailsSchema;
