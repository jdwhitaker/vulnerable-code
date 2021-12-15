const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = 8080

const app = express()
app.use(bodyParser.json())
// we can pretend storing the user ID in an unencrypted 
// cookie is secure for the purposes of this demo
app.use(cookieParser()); 

users = {
	0: {
		name: 'Luke',
		admin: true,
		favoriteColor: 'blue',
		favoriteFood: 'pizza'
	},
	1: {
		name: 'John',
		admin: false,
		favoriteColor: 'green',
		favoriteFood: 'macaroni'
	}
}

// get user favorites
app.get('/favorites', (req, res) => {
	const userId = req.cookies.userId;
	if(!(userId in users)){
		res.sendStatus(404);
		return;
	} 
	const entry = users[userId];
	const returnValue = {}
	for(let key of ['favoriteColor', 'favoriteFood']){
		returnValue[key] = entry[key];
	}
	res.send(returnValue);
})

// update user favorites
app.post('/favorites', (req, res) => {
	const userId = req.cookies.userId;
	if(!(userId in users)){
		res.sendStatus(404);
		return;
	} 
	const entry = users[userId];
	// update entry with user supplied favorites
	for(let key of Object.keys(req.body)){
		entry[key] = req.body[key];
	}
	res.sendStatus(200);
})

// admins only
app.get('/admin', (req, res) => {
	const userId = req.cookies.userId;
	if(!(userId in users)){
		res.sendStatus(404);
		return;
	} 
	const entry = users[userId];
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
