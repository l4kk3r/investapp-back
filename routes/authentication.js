const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {JWTOKEN} = require('../secret');
const User = mongoose.model("User")
const {telebot, } = require('../bots/telegram')
const checkToken = require('../middleware/checkToken')
const mail_check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const saltRounds = bcrypt.genSaltSync(10);

//routes for any users

router.post('/user/signup', async function (req, res) {
    try {
        const { acctype, firstname, lastname, companyname, email, phone, password } = req.body

        if (!mail_check.test(String(email).toLowerCase())) {
            res.status(422).json({err: "Введите корректный email"})
            return 1;
        }
    
        const foundUserEmail = await User.findOne({email})
        if (foundUserEmail) return res.status(422).json({err: "Введённый email уже зарегистрирован"})
    
        const foundUserPhone = await User.findOne({phone})
        if (foundUserPhone) return res.status(422).json({err: "Введённый номер телефона уже зарегистрирован"})
    
        const user = new User({
            acctype,
            status:'Модерация',
            firstname,
            lastname,
            email,
            phone,
            companyname,
            password
        })
    
        const hashedPassword = bcrypt.hash(password, saltRounds)
    
        //hash password
        user.password = hashedPassword
        await user.save()
        telebot.sendMessage('@inv777', `👨‍💻#НовыйПользователь\nФИО: ${firstname + ' ' + lastname}\nТелефон: ${phone}\nСвяжитесь с ним в течение 5 минут!`)
        res.json({message:"Пользователь успешно создан"})
    } catch (err) {
        res.status(403).json({message: 'Произошла непридвиденная ошибка'})
    }
})

router.post('/user/signin', async function (req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({err: "Пожалуйста, заполните все поля"});
        }
    
        const existingUser = User.findOne({email})
        if (!existingUser) return res.status(422).json({err: "Неправильный email или пароль"})
    
        const isPasswordRight = bcrypt.compare(password, savedUser.password)
    
        if (!isPasswordRight) return res.status(422).json({err: "Неправильный email или пароль"})
        
        token = jwt.sign({id: savedUser.id}, JWTOKEN)
        const {_id, id, firstname, lastname, email, acctype, companyname, phone, status} = existingUser
        res.json({message:"Успешный вход", token, user:{_id, id, status, acctype, firstname, lastname, companyname, email, phone}})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }   
})

router.post('/user/updateuser', checkToken, async function (req, res) {
    try {
        const {id} = req.user
        await User.updateOne({id}, {$set: req.body})
        res.json({message:"Пользователь изменен"})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }   
})

router.get('/user/userdata/', checkToken, async function (req, res) {
    const {id} = req.user
    const user = User.findOne({id}).select('-password -_id')
    res.json({userdata: user})
})

router.post('/user/userdata/', checkToken, async function (req, res) {
    try {
        const {id} = req.user
        await User.updateOne({id}, {$set: req.body})
        res.json({message:"Пользователь изменен"})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }
})

// admin routes
router.get('/admin/allusers', checkToken, onlyAdminsRoute, async function (req, res) {
    const allUsers = await User.find({})
    res.json({users: allUsers})
})


module.exports = router