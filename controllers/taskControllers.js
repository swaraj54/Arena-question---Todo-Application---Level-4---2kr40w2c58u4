const Users = require("../models/user.js");
const jwt = require("jsonwebtoken");
const Tasks = require("../models/task.js");
const bcrypt = require('bcrypt');
const { valid } = require("joi");
const JWT_SECRET = "newtonSchool";


const createTask = async (req, res) => {

    //creator_id is user id who have created this task.

    const { heading, description, token } = req.body;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid token'
        });
    }
    const creator_id = decodedToken.userId;

    const newtask = {
        heading,
        description,
        creator_id
    };

    try {
        const task = await Tasks.create(newtask);
        res.status(200).json({
            message: 'Task added successfully',
            task_id: task._id,
            status: 'success'
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    };

}


const getdetailTask = async (req, res) => {

    const task_id = req.body.task_id;

    try {
        const task = await Tasks.findById(task_id);
        res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

const updateTask = async (req, res) => {

    const task_id = req.body.task_id;
    try {
        const task = await Tasks.findByIdAndUpdate(
            task_id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: task
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            data: err.message
        });
    }

}


const deleteTask = async (req, res) => {

    const { task_id, token } = req.body;

    try {
        await Tasks.findByIdAndDelete(task_id);
        res.status(200).json({
            status: 'success',
            message: 'Task deleted successfully'
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    };

}

/*

req.body = {
    token: token
}

can be given status in query.
/api/v1/task/?status=pending
/api/v1/task/

if status is given filter only document contaning Status value as query status.

if token belongs to admin than show task of all user.
if token belongs to any other user than show task belong to that user only.
Payload Structure is given in loginUser controller.

response:

200 status Code
json = {
        status:'success',
        data: [//contaning all task object].
    }

and sort the return data in opposite order of creation date.
the latest data will be at the top.

*/

const getallTask = async (req, res) => {
    try {
        const { token } = req.body;
        const { status } = req.query;
        if (!token) return res.status(401).json({ status: "fail", message: "Authentication failed: Missing token." })
        let query = {};
        if (status) {
            query.status = status;
        }
        try {
            const decodedToken = jwt.verify(token, JWT_SECRET);
            if (decodedToken) {
                const id = decodedToken?.userId;

                const user = await Users.findById(id);
                if (user.role != "admin") {
                    query.creator_id = id;
                }
                console.log(query, "query here")
                const allTodos = await Tasks.find(query)
                return res.status(200).json({
                    status: 'success',
                    data: allTodos
                });
            } else {
                throw new Error("Internal Server Error")
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message, status: "error" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "fail", error: error.message })
    }
}


module.exports = { createTask, getdetailTask, updateTask, deleteTask, getallTask };
