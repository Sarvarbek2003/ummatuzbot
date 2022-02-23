const TelegramBot = require('node-telegram-bot-api');

require('../config.js')
let token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true});

const {selectAudios, update, insert, select, selectSet, deleteAudio } = require('./util.js')
const audiosMenu = require('./menus/audios.js')
const videosMenu = require('./menus/videos.js')

const audiosAdmin = require('./admin/audios.js')
const adm = require('./admin/admin.js')

const { home, date ,category, adminmenu } = require('./menu.js')

bot.on('text', async(msg) => {
    let u = await selectSet()
    let admins = (await select()).map(user => user.is_admin == true ? +user.user_id : [])
    const chatId = msg.chat.id;
    const admin = admins.includes(chatId) 
    const text = msg.text

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')

    if(text == '/start'){
        let userId = (await select()).find(user => user.user_id == chatId)
        if (!userId) await insert(chatId, ['home'])
        else update(chatId, ['home'])
        bot.sendMessage(chatId, `Ассалому алайкум!\n\n@${u.telegram} саҳифасининг расмий ботига хуш келибсиз!`,{
            reply_markup: home
        })  
    }
    else if(text == '/admin' && admin){
        if (steep[steep.length - 1] != 'admin') steep = ['home','admin'], await update(chatId, steep)
        bot.sendMessage(chatId, 'Админ панел',{
            reply_markup: adminmenu
        })
    }
    else if(steep[1] == 'admin'){
        adm(bot,msg)
    }
    if(text == '🔙 Ортга'){
        if (steep.length == 1) return
        steep.splice(-1, 1)
        await update(chatId, steep)
        menu(steep[steep.length - 1], chatId)
    }
    else if(steep[0] == 'home'){
        if ((text == '🎙 Аудио маърузалар' || steep[1] == 'audiomenu') && steep[1] != 'admin'){
            audiosMenu.send(bot,msg)
        }
        else if(text == '🎥 Видео марузалар' || steep[1] == 'videomenu'){
            videosMenu
        }
    }
});

bot.on('audio', async(msg) => {
    let admins = (await select()).map(user => user.is_admin == true ? +user.user_id : [])
    console.log(msg)
    const chatId = msg.chat.id;
    const admin = admins.includes(chatId) 

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')

    if(steep[steep.length - 1] == 'sendAudio' && admin){
        audiosAdmin.juma(bot, msg)
    }
    else if(steep[steep.length - 1] == 'sendMaruza' && admin){
        audiosAdmin.maruza(bot,msg)
    }
})

bot.on('callback_query', async(msg) =>{
    if(msg.data == 'del'){
        await deleteAudio(msg.message.audio.file_unique_id)
        bot.deleteMessage(msg.from.id,msg.message.message_id)
    }
})

const menu = (steep,chatId) => {
    if (steep == 'juma'){
        bot.sendMessage(chatId, 'Жума марузалари, йилни танланг 👇',{
            reply_markup:date
        })
    }
    else if (steep == 'maruza'){
        bot.sendMessage(chatId, 'Марузалар топлами, йилни танланг 👇',{
            reply_markup:date
        })
    }
    else if (steep == 'audiomenu'){
        bot.sendMessage(chatId, 'Аудио марузалар',{
            reply_markup:category
        })
    }
    else if (steep == 'home'){
        bot.sendMessage(chatId, 'Бош саҳифа',{
            reply_markup:home
        })
    }
    else if (steep == 'admin'){
        bot.sendMessage(chatId, 'Admin саҳифа',{
            reply_markup:adminmenu
        })
    }
}