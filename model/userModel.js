const database = require("../utils/database")

const UserModel = {

    async CreateUser(userData){
       
        let query=`INSERT INTO tbl_signup(username,phonenumber,email,address,gender,bloodgroup,
            alternative_phone_no,DOB,qualification,password,confirm_password) 
            values ('${userData.username}','${userData.phonenumber}','${userData.email}','${userData.address}','${userData.gender}',
            '${userData.bloodgroup}','${userData.alternative_phone_no}','${userData.dob}','${userData.qualification}',
            '${userData.password}','${userData.confirm_password}')`;
        return database.promise().query(query)
    },
    async checkUser(data){
        return query = await database.promise().query(`select * from tbl_signup u where u.email = '${data.email}'`);
    },

    async loginUser(data){
        return query = await database.promise().query(`select * from tbl_signup u where u.email = '${data.email}' and u.password = '${data.password}'`);
    },

    async GetAllUser(){
        return query = await database.promise().query(`select * from tbl_signup`);
    },
    async getUser(data){

        return query = await database.promise().query(`select * from tbl_signup u where u.signup_id = ${data.signup_id}`);

    },
    async updateUser(data){

        return query = await database.promise().query(`update tbl_signup set username = '${data.username}',phonenumber = '${data.phonenumber}',email = '${data.email}',address = '${data.address}',gender = '${data.gender}',bloodgroup = '${data.bloodgroup}',alternative_phone_no = '${data.alternative_phone_no}',DOB = '${data.dob}',qualification = '${data.qualification}' where signup_id = ${data.signup_id}`);

    },
    async deleteUser(data){

        return query = await database.promise().query(`delete from tbl_signup u where u.signup_id = ${data.signup_id}`);

    },
}

module.exports=UserModel;