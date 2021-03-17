const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const TelegramBot = require('node-telegram-bot-api');
const {TELEGRAM_TOKEN, } = require('../secret')

const token = TELEGRAM_TOKEN;
const telebot = new TelegramBot(token, {polling: true});
telebot.onText(/\/verify/, (msg) => {
    const chatId = msg.chat.id;
    User.findOneAndUpdate({email: msg.text.replace('/verify','').replace(/\s/g, ""), telegram_login: 00},{$set: {telegram_notify: 'available', telegram_login: msg.chat.id}}).then(ans=> {ans ? telebot.sendMessage(chatId, `${ans.firstname} ${ans.lastname}, ваш аккаунт успешно привязан.`) : telebot.sendMessage(chatId, 'Ключ не был найден')})
});

module.exports = {telebot: telebot}