const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');

const userSchema = new mongoose.Schema({
    acctype: {
        type: String,
        required:true
    },
    id: {
        type: Number
    },
    status: {
        type: String,
        default: 'zero'
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    }, 
    middlename: {
        type: String
    },
    sex: {
        type: String
    },
    birthday: {
        type: String
    },
    citizenship: {
        type: String
    },
    snils: {
        type: String
    },
    inn: {
        type: String
    },
    companyname:{
        type: String,
        default: null
    },
    telegram_notify: {
        type: String,
        default: 'disable'
    },
    telegram_login: {
        type: Number,
        default: 00
    },
    fmin_amount: {
        type: Number,
        default: 0
    },
    fmax_amount: {
        type: Number,
        default: -10000000000
    },
    fobject_flat: {
        type: Boolean,
        default: true
    },
    fobject_house: {
        type: Boolean,
        default: true
    },
    fobject_commercion: {
        type: Boolean,
        default: true
    },
    fobject_field: {
        type: Boolean,
        default: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    adress_region: {
        type: String
    },
    adress_district: {
        type: String
    },
    adress_city: {
        type: String
    },
    adress_street: {
        type: String
    },
    adress_house: {
        type: String
    },
    adress_building: {
        type: String
    },
    adress_flat: {
        type: String
    },
    adress_zip: {
        type: String
    },
    adress_okato: {
        type: String
    },
    adress_oktmo: {
        type: String
    },
    adress_kladr: {
        type: String
    },
    bank_fio: {
        type: String
    },
    bank_rasschet: {
        type: String
    },
    bank_name: {
        type: String
    },
    bank_corschet: {
        type: String
    },
    bank_bik: {
        type: String
    },
    bank_kpp: {
        type: String
    },
    bank_inn: {
        type: String
    }
})

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

mongoose.model("User",userSchema)