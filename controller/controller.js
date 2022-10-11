// const { request } = require("express");
// const { ConnectionPool } = require("mssql");
const mssql = require('mssql');
const conf = require('../dbconfig.json');
const emailSend = require('../controller/mailController');

class Controller {
	async test2(req,res){
        emailSend.sendMail(req,res);
    }

    async testSelect(req, res){
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options:{
                    encrypt:false
                }
            })
            const result = await mssql.query`select * from testTable`
            res.send(result);
            console.log("success : " + result);
        } catch (err) {
            console.log("err : " + err)
        }
    }
    async Read(req, res){
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options:{
                    encrypt:false
                }
            })
            const result = await mssql.query`select * from testTable`
            res.send(result);
            console.log("success : " + result);
        } catch (err) {
            console.log("err : " + err)
        }
    }
    async Create(req, res){
        // console.log(req.body.uid);
	const name = req.body.name;
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options:{
                    encrypt:false
                }
            })
            await mssql.query(`insert into testTable (name) values ('${name}')`).then(res.send({result:"Success!!"}))
            // res.send(result);
            console.log("success : " + result);
        } catch (err) {
            console.log("err : " + err)
        }
    }
	async Select(req, res){
        const id = req.params('id');
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options:{
                    encrypt:false
                }
            })
            const result = await mssql.query`select name from testTable where id = 3`
	    res.send(result);
            console.log("success : " + result);
        } catch (err) {
            console.log("err : " + err)
        }
    }
    async CheckEmail(req, res){
        const email = req.body.email;
    
        try{
            await mssql.connect({
                database:conf.database,
                server:conf.server,
                user:conf.user,
                password: conf.password,
                options: {
                    encrypt: false
                }
            })
            const result = await mssql.query`SELECT * FROM T_MEMBER WHERE Email = ${email}`
            res.send(result);
        }catch(err){
            console.log(err)
        }

    }
    async CheckBizNo(req, res) {

        const bizNo = req.body.biz;
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options: {
                    encrypt: false
                }
            })
            const result = await mssql.query`SELECT * FROM T_MEMBER WHERE BizNo = ${bizNo}`
            res.send(result);
        } catch (err) {

        }
    }
    async CheckId(req, res) {

        const id = req.body.id;
        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options: {
                    encrypt: false
                }
            })
            const result = await mssql.query`SELECT * FROM T_MEMBER WHERE UserID = ${id}`
            res.send(result);
        }
        catch (err) {
            console.log(err);
        }
    }
    async TestFormData(req, res) {
        const id = req.body.id;
            res.send({"data":id});
    }
}
const controller = new Controller();
module.exports = controller;