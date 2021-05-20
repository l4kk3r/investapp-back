const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    access_year: {
        type: String
    },
    creator_id: {
        type: Number,
        required: true
    },
    borrower_lname: {
        type: String,
        required: true
    },
    price_link: {
        type: String
    },
    status: {
        type: String,
        default: 'На модерации'
    },
    isIP: {
        type: String,
        required: true
    },
    deal_type: {
        type: String,
        required: true
    },
    loan_type: {
        type: String,
        required: true
    },
    borrower_work: {
        type: String
    },
    object: {
        type: String,
        required:true
    },
    adress_link: {
        type: String
    },
    city:{
        type:String,
        required:true
    },
    region: {
        type: String,
        required: true
    },
    adress:{
        type:String
    },
    archive: {
        type: String
    },
    rate:{
        type:SchemaTypes.Double,
        required:true
    }, 
    amount:{
        type: Number,
        required:true
    },
    zalog: {
        type: Number
    },
    reason:{
        type: String,
        required: true
    },
    period:{
        type: String,
        required: true
    },
    owners_number: {
        type: Number
    },
    kadastr_tag: {
        type:String
    },
    kadastr_tag2: {
        type:String
    },
    photos: {
        type: [{type: String}],
        required:true
    },
    document: {
        type: String
    },
    coordinates_x: {
        type: SchemaTypes.Double
    },
    coordinates_y: {
        type: SchemaTypes.Double
    },
    fiz: {
        type: [{status: String, firstname: String, middlename: String, lastname: String, fssp: Number, bankrupt: String, convictions: String, convictions_links: [{type: String}], birth: String, age: Number, pnumber: String, pdate: String, inn: Number, snils: Number, doсument: String, regyear: Number, rosreestr: String, percents: String, family: String, agreement: String, mothercapital: String, kids: String}]
    }
},{ timestamps: true })

postSchema.plugin(autoIncrement.plugin, {
    model: 'Post',
    field: 'id',
    startAt: 100,
    incrementBy: 1
});

mongoose.model("Post",postSchema)