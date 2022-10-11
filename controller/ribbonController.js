const { sql, poolPromise } = require('../db')
const fs = require('fs');
var rawdata = fs.readFileSync('./query/ribbon.json');
var queries = JSON.parse(rawdata);

class ribbonController {
  
    async ribbonList (req, res){
        try{
            const uid = req.params.userid;
            const type = req.params.type;
            
            const pool = await poolPromise;
            var result = await pool
                .request()
                .input("type", type)
                .input("dealerId", uid)
                .query(queries.testribbonlist);

                res.send({data:result.recordset})
            console.log(result.recordset);
        }
        catch(err){
            console.log(err);
        }
    }
    async ribbonAdd (req, res){
        try{
            const uid = req.params.uid;
            const type = req.params.type;
            const text = req.params.text;

            const pool = await poolPromise;
            var result = await pool
            .request()
            .input('uid', uid)
            .input('type', type)
            .input('text', text)
            .query(queries.testinsribbon);

            res.send({result:true});

            console.log(result);

        }catch(err){
            console.log(err);
        }
    }

    async delribbon (req, res){
        try{
            const uid = req.body.uid;
            console.log(uid.length);
            console.log(uid);
            const pool = await poolPromise;
            for(var i in uid){
                var result = await pool
                .request()
                .input('uid', uid[i])
                .query(queries.testdelribbon);
            }

            res.send({result:true});


        }catch(err){
            console.log(err);
        }
    }

}

const controller = new ribbonController()
module.exports = controller;