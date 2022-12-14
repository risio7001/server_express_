const {sql, poolPromise} = require('../db');
const fs = require('fs');
var rawdata = fs.readFileSync('./query/cscenter.json');
var queries = JSON.parse(rawdata);
const sha512 = require('js-sha512');
const { pool } = require('mssql');

class cscenterController {
    async csList (req, res){
        try{
            const siteid = req.params.siteid;
            const userid = req.params.userid;

            let temp = [];

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('siteid', siteid)
            .input('userid', userid)
            .query(queries.TESTcslist);
            
            for(var i in result.recordset){
                temp.push({
                    "Uid": result.recordset[i].Uid,
                    "SiteID": result.recordset[i].SiteID,
                    "Consult": result.recordset[i].Consult,
                    "Subject": result.recordset[i].Subject,
                    "UserID": result.recordset[i].UserID,
                    "Content": result.recordset[i].Content,
                    "Email": result.recordset[i].Email,
                    "IsReplyEmail": result.recordset[i].IsReplyEmail,
                    "Mobile": result.recordset[i].Mobile,
                    "IsReplySms": result.recordset[i].IsReplySms,
                    "RegDate": result.recordset[i].RegDate,
                    "PartnerID": result.recordset[i].PartnerID,
                    "writer": result.recordset[i].writer,
                    "FILES": result.recordset[i].FILES,
                    "godoQUid": result.recordset[i].godoQUid,
                    "answer":null
                })
                let answer_temp = [];
                var answer = await pool
                    .request()
                    .input('uid', result.recordset[i].Uid)
                    // .input('uid', '234')
                    .query(queries.csanswer);
                    
                if(answer.recordset.length > 0){
                    for(var j in answer.recordset){
                        answer_temp.push({
                            'Uid': answer.recordset[j].Uid,
                            'AdminID': answer.recordset[j].AdminID,
                            'Subject': answer.recordset[j].Subject,
                            'Content': answer.recordset[j].Content,
                            'RegDate': answer.recordset[j].RegDate,
                            'godoQUid': answer.recordset[j].godoQUid,
                        })
                    }
                    temp[i].answer = answer_temp;
                }
            }
            res.send({data:temp});
        }catch(err){
            console.log(err);
        }
    }

    async consultCode (req, res){
        try{
            const pool = await poolPromise;
            var result = await pool
            .request()
            .query(queries.csCode);
            res.send({data:result.recordset});
        }catch(err){
            console.log(err);
        }
    }

    async csmodify (req, res){
        try{
            const uid = req.params.uid;
            const consult = req.body.consult;
            const subject = req.body.subject;
            const content = req.body.content;
            const email = req.body.email;
            const mobile = req.body.mobile;

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input("uid", uid)
            .input("consult", consult)
            .input("subject", subject)
            .input("content", content)
            .input("email", email)
            .input("mobile", mobile)
            .query(queries.TESTcsUpdate);
            res.send({result:true});

        }catch(err){
            console.log(err);
        }
    }

    async csinsert (req, res){
        try{
            const subject = req.body.subject;
            const consult = req.body.consult;
            const userid = req.body.userid;
            const content = req.body.content;
            const email = req.body.email;
            const mobile = req.body.mobile;

            const pool = await poolPromise;
            var result = pool
            .request()
            .input("subject",subject)
            .input("consult",consult)
            .input("userid",userid)
            .input("content",content)
            .input("email",email)
            .input("mobile",mobile)
            .query(queries.TESTcsInsert);
            res.send({result : true});

        }catch(err){
            console.log(err);
        }
    }

    async csdel (req,res){
        try{
            const uid = req.params.uid;

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input("uid", uid)
            .query(queries.TESTcsdel);
            res.send({result:true});

        }catch(err){
            console.log(err);
        }
    }

    ///////////////// ???????????? ///////////////////////
    async member(req,res){
        try{
            // console.log("11")
            const uid = req.body.uid;
            
            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('uid', uid)
            .query(queries.TESTcsMemberGet);
            // console.log(result);
            res.send({data:result.recordset});

        }
        catch(err){
            console.log(err);
        }
    }

    async memberMap(req, res){
        try{
            const uid = req.body.uid;

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('uid', uid)
            .query(queries.TESTcsMap)
            // console.log(result);
            res.send({data:result.recordset});
        }
        catch(err){
            console.log(err);
        }
    }

    async memberModify(req, res) {
        try {
            const dealerId = req.body.dealerId;
            const siteID = 'flda'
            const dealerType = 'BIZ'
    
            const dealerName = req.body.dealerName//	' ?????????
            const chName = req.body.chName	//	' ????????????
            const id = req.body.id
            const pass = req.body.pass
            const rePass = req.body.rePass
            // const pwd = sha512(req.body.pwd);
            let pwd;
            const mobile = req.body.mobile
            // mobile =req.body.mobile,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3"
            const emailId = req.body.email
            const tel = req.body.tel
            // tel = eRegiReplace(tel,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3")
            const bizNo = req.body.bizNo				//	' ???????????????
            const fax = req.body.fax
            // fax = eRegiReplace(fax,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3")
            const dealerEtc1 = req.body.dealerEtc1	//	' ??????????????????
            const post = req.body.post
            const addr = req.body.addr
            const addrDetail = req.body.addrDetail
            const addrLat = req.body.addrLat // ??????
            const addrLng = req.body.addrLng // ??????
            const dealerEtc2 = req.body.dealerEtc2	//	' ??????????????????
            // const dealerEtc3 = req.body.dealerEtc3	//	' ?????????, ?????????, ????????? ????????
            const bank = req.body.bank				//	' ??????
            const account = req.body.account			//' ??????
            const depositor = req.body.depositor	//	' ?????????
            const rec_member = req.body.recMember	//' ????????????????????????
            const deliveryCode = req.body.deliveryCode//	' ?????????????????? ??????
            const deliveryAddrName = req.body.deliveryAddrName	//' ?????????????????? ???
            const dealerEtc5 = req.body.dealerEtc5	//	' ????????? ?????? ??????
            const channel = req.body.channel			//		' ????????????
            let raddr = JSON.parse(req.body.raddr);
            const checkPass = req.body.checkPass;

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('authId', dealerId)
            .query(queries.TESTcsMember)
            // console.log(result.recordset[0].uid);
            let mimUid = result.recordset[0].Uid;
            // console.log(result);
            console.log(checkPass);
            if(checkPass === true){
                pwd = req.body.pwd
            }
            else{
                pwd = result.recordset[0].Pass
            }
            // res.send({data:result});
            console.log(dealerName)
            var result = await pool
            .request()
            .input("dealerName", dealerName)
            .input("pwd", pwd)
            .input("siteID", siteID)
            .input("uid", mimUid)
            .query(queries.TESTcsMemberMimModify);

            var result = await pool
            .request()
            .input("dealerName", dealerName)
            .input("pwd", pwd)
            .input("siteID", siteID)
            .input("uid", mimUid)
            .input("bizNo", bizNo)
            .input("bank", bank)
            .input("account", account)
            .input("depositor", depositor)
            .input("chName", chName)
            .input("tel", tel)
            .input("mobile", mobile)
            .input("fax", fax)
            .input("emailId", emailId)
            .input("post", post)
            .input("addr", addr)
            .input("addrDetail", addrDetail)
            .input("addrLat", addrLat)
            .input("addrLng", addrLng)
            .input("dealerEtc2", dealerEtc2)
            .input("dealerEtc5", dealerEtc5)
            .query(queries.TESTcsMemberInfoModify);
            console.log("check");

            //  ????????? ?????? ?????? ?????? ??????

            let addr_code;
            let addr_name;
            // console.log(raddr);
            // ??????
            var result = await pool
                .request()
                .input('dealerId', dealerId)
                .input('siteId', siteID)
                .query(queries.TESTcsMemberDeliverySelect);
            // console.log(result.recordset.length);
            // console.log(raddr[0].sido);

            // ??????

            let del_code = result.recordset;
            // console.log(del_code.length);
            // console.log(del_code[1]);
            for(var i in del_code){
                var result = await pool
                .request()
                .input('del_code', del_code[i].addr_code)
                .input('dealerId', dealerId)
                .input('siteId', siteID)
                .query(queries.TESTcsMemberDeliveryDelete);
            }
            // console.log(result);

            // ?????? ??? ?????? ????????? ?????? ?????????
            for(var i in raddr){
                for(var j in raddr[i].dong){
                    addr_code = raddr[i].dong[j].code;
                    addr_name = raddr[i].sido + " " + raddr[i].dong[j].name;
                    console.log(addr_name);
                    await pool.request()
                        .input('addr_name', addr_name)
                        .input('addr_code', addr_code)
                        .input('id',dealerId)
                        .input('siteID', siteID)
                        .query(queries.TESTcsMemberDeliveryInsert);
                }
            }
            res.send({result:true});
            
        }
        catch (err) {
            console.log(err);
        }
    }

    // async addrTest (req, res){
    //     try {
    //         const dealer = req.body.dealer;
    //         const siteId = 'flda'

    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }
    
}
const controller = new cscenterController();
module.exports = controller;