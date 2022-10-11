let sql = require('mssql');
const dbconn = require('./dbconfig.json');

const poolPromise = new sql
    .ConnectionPool({
        database: dbconn.database,
        server: dbconn.server,
        user: dbconn.user,
        password: dbconn.password,
        options: {
            encrypt: false
        }
    })
    .connect()
    .then(pool => {
        console.log('connection!');
        return pool
    })
    .catch(err => console.log("connection ERR => " + err));
module.exports = {
    sql,
    poolPromise
}