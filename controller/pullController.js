// const mssql = require('mssql');
// const conf = require('../dbconfig.json');
// const sha512 = require('js-sha512')
// const nodemailer = require('nodemailer');
const fs = require('fs');
const { poolPromise, sql } = require('../db');
var query_data = fs.readFileSync('./query/pull.json');
var queries = JSON.parse(query_data);

class PullController {

    async pullCount(req, res) {
        try {
            let count = [];
            let userid = req.query.userid;
            const pool = await poolPromise;

            var result = await pool
                .request()
                .input('userid', userid)
                .query(queries.count_ready);
            count.push(result.recordset[0].TotalCnt);

            var result = await pool
                .request()
                .input('userid', userid)
                .query(queries.count_ing);
            count.push(result.recordset[0].TotalCnt);

            var result = await pool
                .request()
                .input('userid', userid)
                .query(queries.count_complete);
            count.push(result.recordset[0].TotalCnt);

            res.send({data:count});

        }
        catch(err){
            console.log(err);
        }
    }

    async pull(req, res){
        try {

            let mode = req.params.mode;
            let page = req.query.page;
            let userid = req.query.userid;
            let qc;
            let q;
            // console.log(mode);
            // console.log(page);
            // console.log(userid);

            if (page == undefined) 
                page = 1;
            
            if (mode == undefined) 
                mode = 'ready';
            
            switch (mode) {
                case 'ing':
                    qc = queries.count_ing;
                    q = queries.list_ing;
                    break;
                case 'ready':
                    qc = queries.count_ready;
                    q = queries.list_ready;
                    break;
                case 'complete':
                    qc = queries.count_complete;
                    q = queries.list_complete;
                    break;
            }

            let cut = 10;
            const pool = await poolPromise
            var result = await pool
                .request()
                .input('userid', sql.VarChar, userid)
                .query(qc);


            if (result.recordset) {

                let cut = 20;
                let total = parseInt(result.recordset[0]['TotalCnt']);
                let total_page = parseInt(total / cut);
                let listSize;
                console.log(total);

                if (page < total_page) {
                    listSize = cut;
                } else {
                    listSize = parseInt(total - (parseInt(page - 1) * cut))
                    if (listSize < 0) 
                        listSize = 0;
                    }
                
                let start = parseInt(page * cut);

                const pool = await poolPromise
                var result = await pool
                    .request()
                    .input('listSize', listSize)
                    .input('start', start)
                    .input('userid', userid)
                    .query(q);
                // console.log(result);
                // console.log(result.recordset);
                res.send({result: true, data: result.recordset})

            }

        } catch (error) {
            res.status(500)
            res.send(error.message)
        }

    }

    async pullDetail (req,res){
        try{
            const uid = req.params.uid
            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('uid', uid)
            .query(queries.detail)
            res.send({data:result.recordset[0]})
            console.log(result);
        }
        catch(err){
            console.log(err);
        }
        
    }
}

const controller = new PullController();
module.exports = controller;