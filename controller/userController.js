var express = require('express');
var mysql = require('mysql2');
var cors = require('cors');
const nodemailer = require("../sendmailer");
var bodyparser = require('body-parser');
const UserModal = require("../model/userModel")
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

const userController={

async createUser(req,res){

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
          // console.log(User);
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

//loginuser
    async loginUser(req,res){

     let userData = req.body;    

     if((userData.email !="") && (userData.password !="")){
  
        let[userDetails]=await UserModal.loginUser(userData)
        if(userDetails[0]){
          let payload = {
            "signup_id" : userDetails[0].signup_id,
          }
          console.log(payload)
          let options = { expiresIn: "90d", issuer : "trainigproject@123" };
          let secret = "trainingproject@123";
          let token = jwt.sign(payload,secret,options);
          console.log(token)
          res.send({
            message: "Logged in successfully.",
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
      async getAllUser(req,res){

  console.log("Hello");

  let getAllUser = await UserModal.GetAllUser();
  if(getAllUser[0].length){
    console.log("Done");
    res.send(getAllUser[0]);
  }
  else{
    console.log("Error");
  }
},
async getUser(req,res){

  let data ={"user":req.params.id};
  let getinUser = await UserModal.getUser(data);

  if(getinUser){
    res.send(getinUser[0]);
  }

},
async updateUser(req,res){

  

  let data ={"user_id":req.params.id,"user_name":req.body.user_name};

  console.log(data);
  let getinUser = await UserModal.updateUser(data);

  if(getinUser){
    res.send(getinUser[0]);
  }

},

 
}


module.exports=userController;

