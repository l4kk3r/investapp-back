const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const Answer = mongoose.model("Answer")
const {telebot, } = require('../bots/telegram')
const checkToken = require('../middleware/checkToken')
 
// telegram-bot-config

//routes for any users
router.post('/user/createpost', checkToken, function (req, res) {
    const post = new Post(req.body)
    post.save().then(post => {
        console.log(post)
        telebot.sendMessage('@inv777', `📝#НоваяЗаявка\nОбъект: ${req.body.object}\nОбработайте её в течение 5 минут!`)
        return res.json({message: "Новая запись успешно создана"})
    }).catch(err=> {
        console.log(err)
        return res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    })
})

router.get('/user/allpublished', function (req, res) {
    Post.find({status: ["Ожидание ответов", "Получен ответ"]}).then(posts => {
        return res.json({posts})
    })
})

router.post('/user/post', function (req, res) {
    const {id} = req.body
    Post.find({id}).then(post => {console.log(post); return res.json({post})})
})

router.post('/user/newanswer', checkToken,  function (req,res) {
    const {amount, rate, period, post_id} = req.body
    const answer = new Answer(req.body)
    answer.save().then(answer=> {
        Post.findOne({id: post_id, status: 'Ожидание ответов'}).then(post => {
            if (post) {
                Post.updateOne( {id: post_id}, {$set: {status: 'Получен ответ'}}).then(ans=>{1+1;})
            }
            telebot.sendMessage('@inv777', `📬#НовыйОтвет\nОбъявление: https://investapp.vercel.app/post/${post_id}\nПредлагаемая сумма: ${amount}\nПредлагаемая ставка: ${rate}\nПредлагаемый срок: ${period}\nОбработайте его в течение 5 минут!`)
            return res.json({message: 'Ответ успешно отправлен'})
        })
    }).catch(err=> {
        console.log(err)
        return res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    })
})

router.post('/user/getposts', function (req, res) {
    const {creator_id} = req.body
    Answer.find({creator_id}).then(answers => {Post.find({creator_id}).then(posts => {return res.json({posts, answers})})})
})

router.post('/user/updatepost', checkToken, function (req, res) {
    const {id} = req.body
    Post.updateOne({id}, {$set: req.body}).then(ans => {return res.json({message: "Запись успешно изменена"})})
})

router.post('/user/answers', function (req, res) {
    const {investor_id} = req.body
    Answer.find({investor_id: investor_id}).then(answers => {return res.json({answers})})
})

router.post('/user/answer-changestatus', checkToken, function (req, res) {
    const {id, status} = req.body
    Answer.updateOne({id}, {$set: {status}}).then(ans =>  {return res.json({message: "Статус ответа успешно изменен"})})
})

//admin routes

router.post('/admin/updatepost', checkToken, function (req, res) {
    const {id} = req.body
    Post.updateOne({id}, {$set: req.body}).then(ans=>{return res.json({message:"Запись изменена"})})
    if (req.body.status === 'Ожидание ответов') {
        User.find({telegram_notify: 'available', fmin_amount: { $gt: req.body.amount }, fmax_amount: {$gt: req.body.amount * -1}}).then(users => {
            for (user in users) {
                console.log(users[user])
                telebot.sendMessage(users[user].telegram_login, `Новое объявление! https://investapp.vercel.app/post/${id}`)
            }
        })
    }
})

router.get('/admin/allposts', checkToken, function (req, res) {
    Answer.find({}).then(answers => {Post.find({}).then(posts => {return res.json({posts, answers})})})
})


module.exports = router