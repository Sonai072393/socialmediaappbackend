import express from 'express'


//controllers
import { 
    getUser,
    getUserList,
    insertUser,
    getProfile,
    insertLog,
    updateLog,
    getLog,
    updateProfile,
    emailCheck,
    updateFriendList, 
    getFriendsList 
} from '../controllers/posts.js';
import { migrationExcel } from '../controllers/migration.js';
const router = express.Router();

//user api's
//user login api
router.post('/getUser',getUser)

//get all user list
router.post('/getUser/list',getUserList)

//update friend list
router.post('/friendList/update',updateFriendList)
router.post('/friends/list',getFriendsList)


//New User insert api
router.post('/insertUser',insertUser)
router.post('/getProfile',getProfile)
router.post('/insertLog',insertLog)
router.post('/updateLog',updateLog)
router.post('/getLog',getLog)
router.post('/updateProfile',updateProfile)
router.post('/emailCheck',emailCheck)


//data migration
router.post('/dataMigration',migrationExcel)





export default router;