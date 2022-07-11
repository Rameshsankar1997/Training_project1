const express = require('express');
const router = express.Router();
const path = require('path');
var UserController=require('../controller/userController')

// Create User

router.post('/createUser',UserController.createUser);

//userlogin
router.post('/loginUser',UserController.loginUser);

// Get All User

router.get('/getallUser',UserController.getAllUser);

// Get User

router.get('/getUser/:id',UserController.getUser);

// Update User

router.put('/updateUser/:id',UserController.updateUser);

// Update User

router.delete('/deleteUser/:id',UserController.deleteUser);

module.exports = router;
