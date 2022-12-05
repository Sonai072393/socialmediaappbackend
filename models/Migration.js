import mongoose from "mongoose";
import autoIncrement from "mongoose-sequence";

import moment from "moment";

const AutoIncrement = autoIncrement(mongoose);

const migrationSchema = mongoose.Schema({
  workType: { type: String, trim: true, default:'-' },
  work: { type: String, trim: true,default:'-'},
  descriptionOfWork: { type: String, trim: true,default:'-'},
  qty: { type: Number, trim: true, default: 0 },
  rate: { type: String, trim: true,default: '-'},
  unit: { type: String, trim: true,default: '-'},
  amount: { type: Number, trim: true, default: 0 },
  USSOR:{ type: String, trim: true, default: '-' },
});
migrationSchema.plugin(AutoIncrement, { inc_field: "earthWork_id" });

const MigrationSchema = mongoose.model("02_earthWork", migrationSchema);

export default MigrationSchema;
