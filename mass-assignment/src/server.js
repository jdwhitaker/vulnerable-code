const datastore = require('./datastore');
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const port = 8080

const app = express()
app.use(bodyParser.json())
app.use(cookieSession({
	name: 'session',
	secret: 'secret-key',
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.post('/authn', (req, res) => {
	console.error('POST /authn');
	const userId = req.body.userId;
	const entry = datastore.getUserData(userId);
	if(!(entry.password === req.body.password)){
		res.sendStatus(401);
		return;
	}
	req.session.userId = req.body.userId;
	res.end();
})

// get user favorites
app.get('/favorites', (req, res) => {
	console.error('GET /favorites');
	const userId = req.session.userId;
	const entry = datastore.getUserData(userId);
	if(!entry){
		res.sendStatus(404);
		return;
	} 
	const returnValue = {}
	for(let key of ['favoriteColor', 'favoriteFood']){
		returnValue[key] = entry[key];
	}
	res.send(returnValue);
})

// update user favorites
app.post('/favorites', (req, res) => {
	console.error('POST /favorites');
	const userId = req.session.userId;
	const entry = datastore.getUserData(userId);
	if(!entry){
		res.sendStatus(404);
		return;
	} 
	for(let key of Object.keys(req.body)){
		entry[key] = req.body[key];
	}
	datastore.setUserData(userId, entry);
	res.sendStatus(200);
})

// admins only
app.get('/admin', (req, res) => {
	console.error('GET /admin');
	const userId = req.session.userId;
	const entry = datastore.getUserData(userId);
	if(!entry){
		res.sendStatus(404);
		return;
	} 
	if(entry.admin){
		res.sendStatus(200);
		return;
	} else {
		res.sendStatus(401);
		return;
	}
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
})
