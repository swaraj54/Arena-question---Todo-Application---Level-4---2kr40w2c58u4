const Tasks   = require("../models/task.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "newtonSchool";

async function isowner(req, res, next) {

    try {
        const { task_id, token} = req.body;
        let decodedToken, user_id;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
            user_id = decodedToken.userId;
        }catch(err){
            res.status(404).json({
                status: 'fail',
                message: 'Invalid token'
            })
        }
        try{
            const task = await Tasks.findById(task_id);
            if(String(task.creator_id) === user_id){
                next();
            }
            else{
                res.status(403).json({
                    status: 'fail',
                    message: 'Access Denied'
                })
            }
        }catch(err){
            res.status(404).json({
                status: 'fail',
                message: 'Given task doesnot exist'
            })
        }   
    } catch (err) {
        return res.status(400).json({
            status: "error",
            message: "Unable to check"
        })
    }
}

module.exports = { isowner };
