const express = require("express");
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const cors = require('cors')
const {MONGOOSE_KEY} = require('./secret');
let PORT = process.env.PORT || 5500

//SERVER SETUP
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

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
autoIncrement.initialize(mongoose.connection);

//models
require('./models/User')
require('./models/Post')
require('./models/Answer')

//START SERVER
require('./bots/telegram')
app.use(require('./routes/authentication'))
app.use(require('./routes/post'))
app.use(require('./routes/aws'))

app.listen(PORT, () => {
    console.log('app started')
})
