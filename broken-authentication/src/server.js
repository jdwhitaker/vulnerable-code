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

async function authenticate(username, password){
    const entry = datastore.getUserData(username);
    if(!(entry.password === password)){
        return false;
    }
    return true;
}

app.post('/authn', (req, res) => {
    console.error('POST /authn');
    const username = req.body.userId;
    const password = req.body.password;
    // Failure to await result of promise
    const authenticated = authenticate(username, password);
    // Javascript's weak typing results in the promise 
    // being implicitly converted to a boolean. 
    if(!authenticated){
        res.sendStatus(401);
        return;
    }
    // Since a promise is not null, it has a value of true.
    req.session.userId = req.body.userId;
    res.sendStatus(200);
    return;
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})
