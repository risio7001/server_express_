// const sql = require("mssql");
// const config = {
//     user: process.env.DB_MSSQL_USER,
//     password: process.env.DB_MSSQL_PASSWORD,
//     server: process.env.DB_MSSQL_IP, // You can use 'localhost\\instance' to connect to named instance
//     database: process.env.DB_MSSQL_DB,
//     options: {
//         encrypt: false, //  Windows Azure 사용중일땐 true
//     },
//     pool: { max: 5, min: 1, idleTimeoutMillis: 30000, },
// };
// const poolPromise = new sql
//     .ConnectionPool(config)
//     .connect()
//     .then((pool) => {
//         console.log("Connected to MSSQL");
//         return pool;
//     })
//     .catch((err) =>
//         console.log("Database Connection Failed! Bad Config: ", err)
//     );
// module.exports = { sql, poolPromise, };
