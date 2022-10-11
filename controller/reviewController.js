const { sql, poolPromise } = require('../db')
const fs = require('fs');
var rawdata = fs.readFileSync('./query/review.json');
var queries = JSON.parse(rawdata);

class reviewController {
    async reviewload(req, res) {
        try {
            let infouid = req.params.infouid

            if (infouid == undefined) {
                return false;
            }
            const pool = await poolPromise
            var result = await pool
                .request()
                .input('infouid', infouid)
                .query(queries.reviewload)

            if (result.recordset.length > 0) {
                console.log(result.recordset[0]);
                res.send(result.recordset[0]);
                // res.send({result: true, data: result.recordset});
            }
            else {
                res.send(null);
                console.log("data 없음")
            }

        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }

    async reviewInsert(req, res) {
        try {
            const infouid = req.body.infouid;
            const content = req.body.content;
            const userid = req.body.userid;
            const username = req.body.username;
            const parPoint = req.body.parPoint;
            var guid;
            var cate;
            // 리뷰에대한 사전 준비 (상품번호 및 카테고리번호 get)
            const pool = await poolPromise;
            var result = await pool
                .request()
                .input('infouid', infouid)
                .query(queries.reviewinfo);

            if (result.recordset[0]) {
                guid = result.recordset[0].GoodsUid;
                cate = result.recordset[0].CateCode;
            }
            else {
                res.send("주문정보 없음.");
            }

            console.log(content);
            console.log(userid);
            console.log(username);
            console.log(parPoint);
            console.log(guid);
            console.log(cate);

            // 상품평 존재 여부 확인 및 inset, update 분기점

            var result = await pool
                .request()
                .input('infouid', infouid)
                .query(queries.reviewexisttest);

            if (result.recordset[0]) {  // 존재 시 update
                var result = await pool
                    .request()
                    .input('infouid', infouid)
                    .input('cate', cate)
                    .input('guid', guid)
                    .input('content', content)
                    .input('userid', userid)
                    .input('username', username)
                    .input('point', parPoint)
                    .query(queries.reviewupdatetest);

                return res.send("update");
            }
            else {              // 미 존재 시 insert
                var result = await pool
                    .request()
                    .input('infouid', infouid)
                    .input('cate', cate)
                    .input('guid', guid)
                    .input('content', content)
                    .input('userid', userid)
                    .input('username', username)
                    .input('point', parPoint)
                    .query(queries.reviewinserttest);
                return res.send("insert");
            }

        } catch (err) {
            console.log(err);
        }
        // const pool = await poolPromise;
        // var result = await pool
        // .request()
        // .input()
        // .query(queries.reviewinserttest);

    }
    async myReview(req, res) {
        try {

            let page = req.query.page;
            let userid = req.query.userid;

            if (page == undefined) 
                page = 1;
            
            const pool = await poolPromise
            var result = await pool
                .request()
                .input('userid', sql.VarChar, userid)
                .query(queries.myreviewcount);

                console.log(result);

            if (result.recordset) {

                let cut = 20;
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

                var result = await pool
                    .request()
                    .input('listSize', sql.Int, listSize)
                    .input('start', sql.Int, start)
                    .input('userid', sql.VarChar, userid)
                    .query(queries.myreviewlist);

                res.send({result: true, data: result.recordset})
                // console.log(result.recordset);

            }

        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }

    async csReview(req, res) {
        console.log('CSreview');
        try {

            let page = req.query.page;

            let userid = req.query.userid;

            if (page == undefined) 
                page = 1;
            
            const pool = await poolPromise
            var result = await pool
                .request()
                .input('userid', sql.VarChar, userid)
                .query(queries.csreviewcount);

            if (result.recordset) {

                let cut = 20;
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

                var result = await pool
                    .request()
                    .input('listSize', sql.Int, listSize)
                    .input('start', sql.Int, start)
                    .input('userid', sql.VarChar, userid)
                    .query(queries.csreviewlist);

                res.send({result: true, data: result.recordset})

            }

        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
    }
    
    async delReview (req, res){
        try{
            const uid = req.params.uid;
            // console.log(uid);
            const pool = await poolPromise;
            var result = await pool
                .request()
                .input("uid", uid)
                .query(queries.reviewdeltest);
            console.log(result);
        }catch(err){
            console.log(err);
        }
    }

}

const controller = new reviewController()
module.exports = controller;