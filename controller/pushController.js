const {sql, poolPromise} = require('../db')
const fs = require('fs');
var rawdata1 = fs.readFileSync('./query/order.json');
var queries1 = JSON.parse(rawdata1);
var rawdata = fs.readFileSync('./query/push.json');
var queries = JSON.parse(rawdata);

class pushController {


    async pushCount(req, res) {
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
                .query(queries.count_waitnew);
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

            var result = await pool
                .request()
                .input('userid', userid)
                .query(queries.count_cancel);
            count.push(result.recordset[0].TotalCnt);

            res.send({data:count});

        }
        catch(err){
            console.log(err);
        }
    }


    async push(req, res) {
        try {

            let mode = req.params.mode;
            let page = req.query.page;
            let userid = req.query.userid;
            let qc;
            let q;

            if (page == undefined) 
                page = 1;
            
            if (mode == undefined) 
                mode = 'ready';
            
            switch (mode) {
                case 'ready':
                    qc = queries.count_ready;
                    q = queries.list_ready;
                    break;
                case 'waitnew':
                    qc = queries.count_waitnew;
                    q = queries.list_waitnew;
                    break;
                case 'ing':
                    qc = queries.count_ing;
                    q = queries.list_ing;
                    break;
                case 'complete':
                    qc = queries.count_complete;
                    q = queries.list_complete;
                    break;
                case 'cancel':
                    qc = queries.count_cancel;
                    q = queries.list_cancel;
                    break;
            }

            const pool = await poolPromise
            var result = await pool
                .request()
                .input('userid', sql.VarChar, userid)
                .query(qc);

            if (result.recordset) {

                let cut = 10;
                let total = parseInt(result.recordset[0]['TotalCnt']);
                let total_page = parseInt(total / cut);
                let listSize;

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
                    .input('userid', sql.VarChar, userid)
                    .input('listSize', sql.Int, listSize)
                    .input('start', sql.Int, start)
                    .query(q);

                    console.log(result);
                res.send({result: true, data: result.recordset})

            }

        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }

    async imgPath (req,res){
        try{
            let data = [];
            const dealerId = req.params.dealer;
            const uid = req.params.uid;
            const pool = await poolPromise
            var result = await pool
            .request()
            .input('uid', uid)
            .query(queries1.order_photo);

            data.push(result.recordset[0].img);

            var result = await pool
            .request()
            .input('dealerId', dealerId)
            .query(queries1.order_dealer);

            data.push(result.recordset[0].mobile, result.recordset[0].uid);
            res.send({data});

        }
        catch(err){

        }
        
    }
}

const controller = new pushController()
module.exports = controller;