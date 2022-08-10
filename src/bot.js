const TelegramBot = require('node-telegram-bot-api');

require('../config.js')
let token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true});

const {selectVideos, viweVideos, update, insert, select, selectSet, deleteAudio } = require('./util.js')
const audiosMenu = require('./menus/audios.js')
const videosMenu = require('./menus/videos.js')

const audiosAdmin = require('./admin/audios.js')
const adm = require('./admin/admin.js')

const { home, date ,category, adminmenu } = require('./menu.js');
const  axios  = require('axios')


bot.on('text', async(msg) => {
    let admins = (await select()).map(user => user.is_admin == true ? +user.user_id : [])
    let u = await selectSet()
    const chatId = msg.chat.id;
    const admin = admins.includes(chatId) 
    const text = msg.text

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    if(steep && steep[2] == 'foydali') steep.splice(2), await update(chatId,steep)

    if(text == '/start'){
        let userId = (await select()).find(user => user.user_id == chatId)
        if (!userId) await insert(chatId, ['home'])
        else await update(chatId, ['home'])
        bot.sendMessage(chatId, `Ассалому алайкум!\n\n@${u?.telegram} саҳифасининг расмий ботига хуш келибсиз!`,{
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
    else if(text == '🔙 Ортга'){
        if(steep[2] == 'foydali') steep.splice(2)
        if (steep.length == 1) return
        if(steep[1]=='videomenu') {
            let index = steep.indexOf('videomenu')
            steep.splice(index)
            await update(chatId, steep)
            await menu(steep[steep.length - 1], chatId)
        }else {
            steep.splice(-1, 1)
            await update(chatId, steep)
            await menu(steep[steep.length - 1], chatId)
        }
        
    }
    else if(steep[0] == 'home'){
        if ((text == '🎙 Аудио маърузалар' || steep[1] == 'audiomenu') && steep[1] != 'admin'){
            audiosMenu.send(bot,msg)
        }
        else if(text == '🎥 Видео маърузалар' || steep[1] == 'videomenu'){
            videosMenu.send(bot, msg)
        }
        else if(text == '❓ Савол бериш'){
            bot.sendMessage(chatId, 'Ассаломуалекум саволингизни ушбу ботда ёзиб қолдиринг\n\n@ummatuzsavolbot')
        }
    }
});

bot.on('audio', async(msg) => {
    let admins = (await select()).map(user => user.is_admin == true ? +user.user_id : [])

    const chatId = msg.chat.id;
    const admin = admins.includes(chatId) 

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')

    if(steep[steep.length - 1] == 'sendAudio' && admin){
        audiosAdmin.juma(bot, msg)
    }
    else if(steep[steep.length - 1] == 'sendMaruza' && admin){
        audiosAdmin.maruza(bot,msg)
    }
    else if(steep[steep.length - 1] == 'sendIlmiy' && admin){
        audiosAdmin.ilmiy(bot,msg)
    }
})

bot.on('callback_query', async(msg) =>{
    let chatId = msg.from.id
    let data = msg.data
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length-1]
    if(data == 'del'){
        await deleteAudio(msg.message.audio.file_unique_id)
        bot.deleteMessage(chatId,msg.message.message_id)
    }
    else if(data == 'next' && steep[2] == 'foydali'){
        if(st != 'foydali'){
            +st++
            steep.push(st), 
            await update(chatId, steep)
            const {txt,array} = await rend(st,4,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            steep.push(1,2)
            await update(chatId, steep) 
            const {txt,array} = await rend(2,4,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } 
    }
    else if(data == 'prev' && steep[2] == 'foydali'){
        if( st == 1 ) return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
        if(st != 'foydali'){  
            steep.splice(-1, 1)
            await update(chatId, steep)
            const {txt,array} = await rend(steep[steep.length-1],4,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            bot.answerCallbackQuery(msg.id,{
                text: "Бу охирги саҳифа"
            })
        }
    }
    else if(data == 'next' && steep[2] == 'jumaVideo'){
        if(st != 'jumaVideo'){
            +st++
            steep.push(st), 
            await update(chatId, steep)
            const {txt,array} = await rend(st,5,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            steep.push(1,2)
            await update(chatId, steep) 
            const {txt,array} = await rend(2,5,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } 
    }
    else if(data == 'prev' && steep[2] == 'jumaVideo'){
        if( st == 1 ) return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
        if(st != 'jumaVideo'){  
            steep.splice(-1, 1)
            await update(chatId, steep)
            const {txt,array} = await rend(steep[steep.length-1],5,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            bot.answerCallbackQuery(msg.id,{
                text: "Бу охирги саҳифа"
            })
        }
    }
    else if(data == 'next' && steep[2] == 'maruzaVideo'){
        if(st != 'maruzaVideo'){
            +st++
            steep.push(st), 
            await update(chatId, steep)
            const {txt,array} = await rend(st,6,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            steep.push(1,2)
            await update(chatId, steep) 
            const {txt,array} = await rend(2,6,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } 
    }
    else if(data == 'prev' && steep[2] == 'maruzaVideo'){
        if( st == 1 ) return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
        if(st != 'maruzaVideo'){  
            steep.splice(-1, 1)
            await update(chatId, steep)
            const {txt,array} = await rend(steep[steep.length-1],6,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            bot.answerCallbackQuery(msg.id,{
                text: "Бу охирги саҳифа"
            })
        }
    }
    else if(data == 'next' && steep[2] == 'ilmiyVideo'){
        if(st != 'ilmiyVideo'){
            +st++
            steep.push(st), 
            await update(chatId, steep)
            const {txt,array} = await rend(st,7,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            steep.push(1,2)
            await update(chatId, steep) 
            const {txt,array} = await rend(2,7,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } 
    }
    else if(data == 'prev' && steep[2] == 'ilmiyVideo'){
        if( st == 1 ) return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
        if(st != 'ilmiyVideo'){  
            steep.splice(-1, 1)
            await update(chatId, steep)
            const {txt,array} = await rend(steep[steep.length-1],7,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            bot.answerCallbackQuery(msg.id,{
                text: "Бу охирги саҳифа"
            })
        }
    }
    else if(data == 'next' && steep[2] == 'savolJavob'){
        if(st != 'savolJavob'){
            +st++
            steep.push(st), 
            await update(chatId, steep)
            const {txt,array} = await rend(st,8,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            steep.push(1,2)
            await update(chatId, steep) 
            const {txt,array} = await rend(2,8,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } 
    }
    else if(data == 'prev' && steep[2] == 'savolJavob'){
        if( st == 1 ) return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
        if(st != 'savolJavob'){  
            steep.splice(-1, 1)
            await update(chatId, steep)
            const {txt,array} = await rend(steep[steep.length-1],8,msg)
            if(!txt || !array) return
            bot.editMessageText(txt,{
                chat_id: chatId,
                message_id: msg.message.message_id,
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: array
                }
            })
        } else {
            bot.answerCallbackQuery(msg.id,{
                text: "Бу охирги саҳифа"
            })
        }
    }
    else if(data.startsWith('down==') && data.split('==')[1]){
        try{
            let res = await viweVideos(data.split('==')[1])
            // console.log(res);
            bot.sendVideo(chatId, res[0].video_tg_id,{
                caption: '🎥 '+res[0].title + '\n\n⏰ Davomiyligi: ' + res[0].time_length+'\n💾 Hajmi: '+(res[0].video_size / 1024 / 1024).toFixed(2)+'MB' 
            })
        }catch(err){
            // console.log(err);
            return bot.answerCallbackQuery(msg.id,{text: "Видеони юкалшда хатолик юз берди бу видео юкланмайди", show_alert: true});
        }
        
    }
    else if(data == 'page' || data == 'no') return
     else {
        try{
            let res = await viweVideos(data)
            let inline = [[{text:"📣 Youtubeda Ko'rish", url: 'https://youtu.be/' + data}]]
            if(res[0].video_tg_id != 'false') inline.push([{text:"📥 Yuklab Olish", callback_data: 'down==' + data}])
            res = res[0]
            bot.sendPhoto(chatId,res.imgurl,{
                caption: '🎥 '+res.title + '\n\n⏰ Davomiyligi: ' + res.time_length,
                reply_markup:{
                    inline_keyboard:inline
                }
        })
        }catch(err){
            return bot.answerCallbackQuery(msg.id,{text: "Хатолик юз берди"});
        }
    }
})

bot.on('photo',async msg => {
    adm(bot,msg)
});


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
    else if (steep == 'adminAudio'){
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup:category
        })
    }
    else if (steep == 'adminFoydali'){
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup:category
        })
    }
}

const rend = async(page = 1,category,msg) => {
    let steep = (await select()).find(user => user.user_id == msg.from.id)?.steep.split(' ')
    if(page < 1) return 'error'
    let res = await selectVideos(category)
    if (res.length == 0) return {txt: "Хозирча контент йўқ", array: [[{text: "❎", callback_data: 'no'}]]}
    if(page > Math.ceil(res.length/10)){
        steep.splice(-1, 1)
        await update(msg.from.id, steep)
        return bot.answerCallbackQuery(msg.id,{text: "Бу охирги саҳифа"})
    } 
    let limit = 10
    let videos = res.slice(page * limit - limit, limit * page)
    let count = 0  
    let array = []
    let arr = [] 
    let txt1 = ''
    videos.map((el,index) => {
        txt1+=`<b>${index + 1}</b>). ` + el.title + ' | ' + el.time_length + '\n➖➖➖➖➖➖➖➖➖\n'
        if(count < 5){
            arr.push({text: index+1, callback_data: el.video_id})
            count++
        }else{
            array.push(arr)  
            arr = []
            count = 1
            arr.push({text: index+1, callback_data: el.video_id})
        }
    })
    array.push(arr)
    let leng = array[1] ? array[0].length+array[1].length : 9
    let txt = `<b>Натижалар ${leng == 10 ? leng * page : res.length} / ${res.length}</b>\n\n`
    txt+=txt1 
    array.push([{text: "⬅️", callback_data: 'prev'},{text: `${page} / ${Math.ceil(res.length/10)}`, callback_data: 'page'},{text: "➡️", callback_data: 'next'}])
    return {txt , array}
}
