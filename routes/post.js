const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const Answer = mongoose.model("Answer")
const {telebot, } = require('../bots/telegram')
const checkToken = require('../middleware/checkToken')
const onlyAdminsRoute = require('../middleware/onlyAdminsRoute')

//routes for any users
router.post('/user/createpost', checkToken, async function (req, res) {
    try {
        const {id} = req.user
        const post = new Post(req.body)
        post.creator_id = id
        await post.save()
        telebot.sendMessage('@inv777', `📝#НоваяЗаявка\nОбъект: ${req.body.object}\nОбработайте её в течение 5 минут!`)
        res.json({message: "Новая запись успешно создана"})
    } catch (err) {
        res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    }
})

router.get('/user/allpublished', async function (req, res) {
    const posts = await Post.find({status: ["Ожидание ответов", "Ожидание ответов ", "Получен ответ"]})
    res.json({posts})
})

router.post('/user/post', async function (req, res) {
    const {id} = req.body
    const post = await Post.find({id})
    res.json({post})
})

router.post('/user/newanswer', checkToken, async function (req,res) {
    try {
        const {amount, rate, period, post_id} = req.body
        const answer = new Answer(req.body)
        await answer.save()
        const post = await Post.findOne({id: post_id, status: 'Ожидание ответов'})
        if (post) {
            Post.updateOne( {id: post_id}, {$set: {status: 'Получен ответ'}})
        }
        telebot.sendMessage('@inv777', `📬#НовыйОтвет\nОбъявление: https://investapp.vercel.app/post/${post_id}\nПредлагаемая сумма: ${amount}\nПредлагаемая ставка: ${rate}\nПредлагаемый срок: ${period}\nОбработайте его в течение 5 минут!`)
        res.json({message: 'Ответ успешно отправлен'})
    } catch (err) {
        return res.json({message: 'Возникла ошибка. Пожалуйста, проверьте правильность введённых данных.'})
    }
})

router.post('/user/getposts', async function (req, res) {
    const {creator_id} = req.body
    const answers = await Answer.find({creator_id})
    const posts = await Post.find({creator_id})
    res.json({posts, answers})
})

router.post('/user/updatepost', checkToken, async function (req, res) {
    try {
        const {id} = req.body
        // Проверка. Редактировать может только создатель
        const post = await Post.findOne({id})
        if (post.creator_id !== req.user.id) return res.status(503).json({message: 'Forbidden'})
        //
        await Post.updateOne({id}, {$set: req.body})
        res.json({message: "Запись успешно изменена"})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }
})

router.post('/user/answers', async function (req, res) {
    const {investor_id} = req.body
    const answers = await Answer.find({investor_id: investor_id})
    res.json({answers})
})

router.post('/user/answer-changestatus', checkToken, async function (req, res) {
    try {
        const {id, status} = req.body
        // Проверка. Редактировать может только создатель
        const answer = await Answer.findOne({id})
        if (answer.creator_id !== req.user.id) return res.status(503).json({message: 'Forbidden'})
        //
        await Answer.updateOne({id}, {$set: {status}})
        res.json({message: "Статус ответа успешно изменен"})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }
})

//admin routes

router.post('/admin/updatepost', checkToken, async function (req, res) {
    try {
        const {id} = req.body
        await Post.updateOne({id}, {$set: req.body})
    } catch (err) {
        res.status(520).json({message: "Неизвестная ошибка"})
    }
    // if (req.body.status === 'Ожидание ответов') {
    //     const users = User.find({telegram_notify: 'available', fmin_amount: { $gt: req.body.amount }, fmax_amount: {$gt: req.body.amount * -1}})
    //     for (user in users) {
    //         console.log(users[user])
    //         telebot.sendMessage(users[user].telegram_login, `Новое объявление! https://investapp.vercel.app/post/${id}`)
    //     }
    // }
})

router.get('/admin/allposts', checkToken, onlyAdminsRoute, async function (req, res) {
    const answers = await Answer.find({})
    const posts = await Post.find({})
    res.json({posts, answers})
})


module.exports = router
