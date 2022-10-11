var express = require('express');
var session = require('./session');
var route = require('./routes/route.js');
// var queries = JSON.parse(rawdata);
const app = express();

app.use(session.passport.initialize());

// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(route);

app.get('/sun/sun/name',(req, res)=>{
	res.send({hello:"hello"})
})

app.post('/sun/sun/login',
	session.passport.authenticate('local', { failureRedirect: '/sun/sun/login' }),
	function (req, res) {
		req.token = session.generateToken(req.user);
		res.json({ token: req.token, user: JSON.stringify(req.user) });
	}
);

app.listen(5000, (req,res)=>{
    console.log("start");
});