import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'

dotenv.config()
///routers
import postRoutes from './routes/posts.js'

const app = express();


app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
// mongodb+srv://<username>:<password>@cluster0.gwavc.mongodb.net/?retryWrites=true&w=majority
// const db_url='mongodb+srv://abhisek23:abhisek23@cluster0.gwavc.mongodb.net/?retryWrites=true&w=majority'
const db_url=process.env.dbUrl
console.log(process.env.dbUrl,"dbURL")

const PORT = 5000

app.use('/posts',postRoutes)

mongoose.connect(db_url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(()=>app.listen(PORT,()=> console.log(`Server Running on port:${PORT}`)))
    .catch((error)=> console.log(error.message));

// mongoose.set('useFindAndModify',false);
