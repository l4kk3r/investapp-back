const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {JWTOKEN} = require('../secret');
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const {telebot, } = require('../bots/telegram')
const checkToken = require('../middleware/checkToken')
const mail_check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const saltRounds = bcrypt.genSaltSync(10);

//routes for any users

router.post('/user/signup', function (req, res) {
    const { acctype, firstname, lastname, companyname, email, phone, password } = req.body

    if (!mail_check.test(String(email).toLowerCase())) {
        res.status(422).json({err: "Введите корректный email"})
        return 1;
    }

    User.findOne({email}).then(foundUser => {
        if (foundUser) {
            res.status(422).json({err: "Введённый email уже зарегистрирован"})
            return 1;
        }
        User.findOne({phone}).then(foundUser => {
            if (foundUser) {
               res.status(422).json({err: "Введённый номер телефона уже зарегистрирован"})
               return 1;
            } 

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

            console.log(password)

            //hash password
            bcrypt.hash(password, saltRounds).then(hashedpass => {
                user.password = hashedpass
                user.save().then(user => {
                    console.log(user)
                    telebot.sendMessage('@inv777', `👨‍💻#НовыйПользователь\nФИО: ${firstname + ' ' + lastname}\nТелефон: ${phone}\nСвяжитесь с ним в течение 5 минут!`)
                    return res.json({message:"Пользователь успешно создан"})
                }).catch(err=> {
                    console.log(err)
                })
            });

        })
    })
})

router.post('/user/signin', function (req, res) {
    const { email, password } = req.body
    console.log(password)
    if (!email || !password) {
        return res.status(422).json({err: "Пожалуйста, заполните все поля"});
    }
    User.findOne({email}).then(savedUser=>{
        if (!savedUser) {
            return res.status(422).json({err: "Неправильный email или пароль"});
        }

        bcrypt.compare(password, savedUser.password).then(passwordMatch => {
            if (!passwordMatch) {
                return res.status(422).json({err: "Неправильный email или пароль"})
            }
            
            token = jwt.sign({id: savedUser.id}, JWTOKEN)
            const {_id, id, firstname, lastname, email, acctype, companyname, phone, status} = savedUser
            return  res.json({message:"Успешный вход", token, user:{_id, id, status, acctype, firstname, lastname, companyname, email, phone}})   
        })
    })
})

router.post('/user/updateuser', function (req, res) {
    const {id} = req.body
    User.updateOne({id}, {$set: req.body}).then(ans=>{return res.json({message:"Пользователь изменен"})})
})

router.get('/user/userdata/', checkToken, function (req, res) {
    User.findOne({id: req.user.id}).select('-password -_id').then(ans => {return res.json({userdata: ans})})
})

router.post('/user/userdata/', checkToken, function (req, res) {
    console.log(req.body)
    User.updateOne({id: req.user.id}, {$set: req.body}).then(ans => {return res.json({message: "Данные успешно сохранены"})})
})

// admin routes
router.get('/admin/allusers', function (req, res) {
    User.find({}).then(users=> {
        return res.json({users})
    }
    )
})


module.exports = router