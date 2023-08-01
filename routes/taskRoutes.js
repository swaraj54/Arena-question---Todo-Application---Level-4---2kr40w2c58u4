const express = require("express");

const { createTask, getdetailTask, updateTask, deleteTask, getallTask } = require("../controllers/taskControllers");
const { isowner } = require("../middleware/taskMiddleware.js");

const router = express.Router();

router.get("/", getallTask);
router.post("/create", createTask);
router.get("/detail", isowner , getdetailTask);
router.post("/delete", isowner, deleteTask);
router.post("/update", isowner, updateTask);

module.exports = router;