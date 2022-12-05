// import migration from "../models/Migration";
import MigrationSchema from '../models/Migration.js'

export const migrationExcel = async (req, res) => {
   
    const post = req.body.data;
  
    console.log("req=>",post)
    const newPost = new MigrationSchema(post);
  
    try {
      await newPost.save();
  
      res.status(201).json(newPost);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };