const { sql, poolPromise} = require('../db');
const env = require('../utils/env');
const fs = require('fs');
const google = require('googleapis');
const nodemailer = require('nodemailer');
var query_data = fs.readFileSync('./query/mail.json');
var queries = JSON.parse(query_data);

const code = {
    "signUp":"101", // 회원가입
    "searchId":"114",   // 아이디 찾기
    "searchPw":"115",   // 패스워드 찾기
}

class mailController {
    async sendMail(req,res){
        const { body } = req;
        const { to, subject } = body;
        try{
            // const pool = await poolPromise;
            // const result = await pool()
            // .request()
            // .input('code', code.signUp)
            // .query(queries.mail_form);

            // console.log(result);

            const pool = await poolPromise;
            const result = await pool
            .request()
            .input('code', code.signUp)
            .query(queries.mail_form);

            // console.log(result.recordset[0].Content);
            let temp = result.recordset[0].Content.replace('[MEMBER_NAME]','가나다');
            
            let googleTransport = await nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: 'blah',
                    clientId: process.env.clientid,
                    clientSecret: process.env.clientsecret,
                    refreshToken: process.env.refreshToken,
                    accessToken: process.env.accessToken,
                    expires: 1484314697598
                }
            }),
            mailOptions = {
                from:`"mailTest"<blah@blah>`,
                to,
                subject,
                html:`${temp}`
            }
            try{
                await googleTransport.sendMail(mailOptions);
    
                googleTransport.close();
            }catch(err){
                console.log(err)
            }
            res.send("Success : ");

        }catch(err){
            console.log(err);
        }
    }
//////////////////////////////////////////////////////////////////////////////////////////
    async sendMailAuth(req,res){
        const { body } = req;
        const { to, subject } = body;

        const strlen = 6;
        let ranSave="";

        for(var i = 1; i <= strlen; i++){
            let ran = Math.floor(Math.random()*10);
            ranSave = ranSave+ran;
        };

        let googleTransport = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: 'blah@blah.co.kr',
                clientId: process.env.clientid,
                clientSecret: process.env.clientsecret,
                refreshToken: process.env.refreshToken,
                accessToken: process.env.accessToken,
                expires: 1484314697598
            }
        }),
        mailOptions = {
            from:`"mailTest"<blah@blah.co.kr>`,
            to,
            subject,
            // text:"인증번호 : " + ranSave
            html:`html`
        }
        try{
            await googleTransport.sendMail(mailOptions);

            googleTransport.close();
        }catch(err){
            console.log(err)
        }
        res.send("Success : " + ranSave);
    }
}

const controller = new mailController();
module.exports = controller;
// res.send({token:authNum})