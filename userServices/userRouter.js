const fs = require("fs");
const { getUsers } = require('./userController');
const userRouter = require("express").Router();

userRouter.get("/getUsers", getUsers)




module.exports = userRouter;