const sql = require('mssql');

/* SQL CONFIG */
const sql_config = {
  user: 'blah',
  password: 'blah',
  server: 'blah',
  database: 'blah',
  options:{
      encrypt:false
  }
}


sql.on('error', err => {
  console.log('SQL ERROR:');
  console.log(err);
})

var conx;
sql.connect(sql_config).then(pool => {
	console.log('connect');
	conx = pool;
});

module.exports = conx;

module.exports = function(query2, params) {
	
	params = params || {}; // default to empty JSON if undefined
	
	var req = conx.request();

	// loop through params JSON and add them as input
	Object.keys(params).forEach(key => {
		req.input(key, params[key]);
	})
		
	return req.query(query2).then(result => {
		return result.recordset;
	}).catch(err => {
		console.log(err);
		return null;
	});
}
