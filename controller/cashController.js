const fs = require('fs');
const { pool } = require('mssql');
const { poolPromise, sql } = require('../db');
var query_data = fs.readFileSync('./query/cash.json');
var queries = JSON.parse(query_data);

class cashController {

    async cashTry(req,res){

        const {body} = req;
        const siteId = body.siteId;
        const personUid = body.personUid;
        const userId = body.userId;
        const totalOrderPrice = body.totalOrderPrice;
        const totalOptionPrice = body.totalOptionPrice;
        const totalDeliveryFee = body.totalDeliveryFee;
        const totalUserDiscountPrice = body.totalUserDiscountPrice;
        const totalEventDiscountPrice = body.totalEventDiscountPrice;

        try{

            const pool = await poolPromise;
            const result = await pool
            .request()
            .input('@SiteID', 'flda')
            .input('@PersonUid', personUid)
            .input('@UserID',userId)
            .input('@TotalOrderPrice',totalOrderPrice)
            .input('@TotalOptionPrice',totalOptionPrice)
            .input('@TotalDeliveryFee',totalDeliveryFee)
            .input('@TotalUserDiscountPrice',totalUserDiscountPrice)
            .input('@TotalEventDiscountPrice',totalEventDiscountPrice)
            .query(queries.cashInsertTry)

        }catch(err){
            console.log(err)
        }
    }
}
const controller = new cashController();
module.exports = controller;