var express = require('express');
var mysql = require('mysql2');
var cors = require('cors');
const nodemailer = require("../sendmailer");
var bodyparser = require('body-parser');
const UserModal = require("../model/userModel")
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

const userController={

  // Create User

  async createUser(req,res)
  {

    let userData = req.body;
    let email = userData.email;

    if(emailValidator.validate(email))
    {
      // console.log("Email is valid");
      let password = userData.password; 
      let confirm_password = userData.confirm_password; 
    
      if(password === confirm_password)
      {

        let[checkUser]=await UserModal.checkUser(userData)

        if(!checkUser[0]){

          let[User]=await UserModal.CreateUser(userData)
      
          if(User.affectedRows>0)
          {
            console.log(User);
            res.send({
              message: "Your account has been created successfully."
            });
            // console.log(userData);
            nodemailer.sendConfirmationEmail(
              userData.username,
              userData.email
            );
        }
        else
        {
          res.send({
            message: "Your account cannot be created at this time."
          });
        }
        }
        else{
          res.send({
            message: "The email address is already in use by another account."
          });
        }
      }
      else{
      res.send({
        message: "Password is missmatched."
      });
    
      }
    }
    else
    {
      res.send({
        message: "Please provide a valid email address."
      });
    }

  },

    //Login User

  async loginUser(req,res)
  {
     let userData = req.body;    

     if((userData.email !="") && (userData.password !="")){
  
        let[userDetails]=await UserModal.loginUser(userData)
        
        if(userDetails[0]){
          let userAlldata = {
            "signup_id"     : userDetails[0].signup_id,
            "username"      : userDetails[0].username,
            "phonenumber"   : userDetails[0].phonenumber,
            "email"         : userDetails[0].email,
            "address"       : userDetails[0].address,
            "gender"        : userDetails[0].gender,
            "bloodgroup"    :  userDetails[0].bloodgroup,
            "alternative_phone_no" : userDetails[0].alternative_phone_no,
            "dob" : userDetails[0].DOB,
            "qualification" : userDetails[0].qualification,
            "password"      : userDetails[0].password
          }
          console.log(userAlldata)
          let payload = {
            "signup_id"     : userDetails[0].signup_id,
            "username"      : userDetails[0].username,
            "phonenumber"   : userDetails[0].phonenumber,
            "email"         : userDetails[0].email,
            "address"       : userDetails[0].address,
            "gender"        : userDetails[0].gender,
            "bloodgroup"    :  userDetails[0].bloodgroup,
            "alternative_phone_no" : userDetails[0].alternative_phone_no,
            "dob" : userDetails[0].DOB,
            "qualification" : userDetails[0].qualification,
          }
          console.log(payload)
          let options = { expiresIn: "90d", issuer : "trainigproject@123" };
          let secret = "trainingproject@123";
          let token = jwt.sign(payload,secret,options);
          console.log(token)
          res.send({
            message: "Logged in successfully.",
            data : userAlldata,
            token : token
          });
        }
        else{
          res.send({
            message: "Email / Password is incorrect."
          });
        }
    
        //  console.log(userDetails[0].password);
        //  if(userDetails[0].password === userData.password){
        //   console.log("Password is corrected");
        //  }
        //  else{
        //   console.log("Password is  incorrected");
        //  }
     }
     else{
      res.send({
        message: "Please Enter the Email and Password."
      });
     }



  },

  // Get All Users

  async getAllUser(req,res)
  {

    let getAllUser = await UserModal.GetAllUser();
    
    if(getAllUser[0].length){
      res.send(getAllUser[0]);
    }
    else{
      console.log("Error");
    }
  },

  // Get User Details

  async getUser(req,res)
  {

    let data ={"signup_id" : req.params.id};

    let getinUser = await UserModal.getUser(data);

    if(getinUser){
      res.send(getinUser[0]);
    }
  },

  // Update User Details

  async updateUser(req,res)
  {
    // console.log(req.body)
    let data = {
      "signup_id"           : req.params.id,
      "username"            : req.body.username,
      "phonenumber"         : req.body.phonenumber,
      "email"               : req.body.email,
      "address"             : req.body.address,
      "gender"              : req.body.gender,
      "bloodgroup"          : req.body.bloodgroup,
      "alternative_phone_no": req.body.alternative_phone_no,
      "DOB"                 : req.body.DOB,
      "qualification"       : req.body.qualification
    };

    // console.log(data);

    let getinUser = await UserModal.updateUser(data);

    console.log(getinUser[0])

    if(getinUser[0].affectedRows>0){
      res.send({
        message : "User data is updated successfully."
      });
    }
    else{
      res.send({
        message : "User data is not updated."
      });
    }
  },

  async deleteUser(req,res)
  {
    let data = {"signup_id" : req.params.id}
    console.log(data)

    let deletedUser = await UserModal.deleteUser(data);
    
    if(deletedUser[0].affectedRows>0)
    {
      res.send({
        message : "User data is deleted successfully."
      });
    }
    else{
      res.send({
        message : "User data is wrong."
      });
    }
  },

}

module.exports=userController;

