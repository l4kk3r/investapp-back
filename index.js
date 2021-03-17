const express = require("express");
const http = require("http");
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {MONGOOSE_KEY} = require('./secret');
let PORT = process.env.PORT || 5500

const bodyParser = require('body-parser')

//SERVER SETUP
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const server = http.createServer(app);
var connection = mongoose.createConnection(MONGOOSE_KEY, { useNewUrlParser: true,  useUnifiedTopology: true, });
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "x-auth-token, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//routes

//MONGODB SETUP
mongoose.connect(MONGOOSE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log('mongoconnected')
})
mongoose.connection.on('error',()=>{
    console.log('mongoerrored')
})
mongoose.set('useCreateIndex', true);
autoIncrement.initialize(connection);
//models
require('./models/User')
require('./models/Post')
require('./models/Answer')

//START SERVER
require('./bots/telegram')
app.use(require('./routes/authentication'))
app.use(require('./routes/post'))
app.use(require('./routes/aws'))
server.listen(PORT, () => {
    console.log('app started')
})
