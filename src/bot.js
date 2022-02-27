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
    if(steep[2] == 'foydali') steep.splice(2), await update(chatId,steep)

    if(text == '/start'){
        let userId = (await select()).find(user => user.user_id == chatId)
        if (!userId) await insert(chatId, ['home'])
        else await update(chatId, ['home'])
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
bot.on('video', async(msg) => {
    let url = 'https://redirector.googlevideo.com/videoplayback?expire=1645813662&ei=PssYYo_GNoWC-gakrK-YDQ&ip=168.119.239.75&id=o-ALWsGYiAqCoqmtCICW1oi1B2mouuVy7UX4PR12JHLMKS&itag=18&source=youtube&requiressl=yes&mh=zs&mm=31%2C26&mn=sn-4g5lzner%2Csn-f5f7lnel&ms=au%2Conr&mv=m&mvi=4&pl=25&initcwndbps=576250&vprv=1&mime=video%2Fmp4&gir=yes&clen=61403213&ratebypass=yes&dur=1409.195&lmt=1645764108287575&mt=1645791649&fvip=4&fexp=24001373%2C24007246&c=ANDROID&txp=5310224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgLmfJ50bmQvi0dkXCvAaJkbZTLo6tyEik1jeC1LxosC0CIQD8wr8RBr5uFdDQFDgKTAum8kwaDitgXq6QgEi7FCXNoQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIge7nOFDzs03dtKBcv2dzltYeWPV5xmOHEyjL-S79w9kgCIGJi41ClFKStY_WNGZVSa-Q89Wh0Yta9RffR_r0SnDbT&utmg=ytap1_6gwvzV93xio'
    let chatId = msg.from.id
    bot.sendVideo(chatId,url)
})
let idd = ''
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
        bot.sendMessage(chatId, 'Юкланмоқда илтимос кутинг...')
        try{
            let options = {
                method: 'GET',
                url: 'https://youtube-search-and-download.p.rapidapi.com/video',
                params: {id: `${data.split('==')[1]}`},
                headers: {
                    'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com',
                    'x-rapidapi-key': '22b60f92d8mshf684b6b2f066e5ep122786jsne54b4b574cfb'
                }
                };
                axios.request(options).then(async function (response) {
                    let err = await bot.sendVideo(chatId, (response.data.streamingData.formats[1].url),{
                        caption: '🎥 '+response.data.videoDetails.title +'\n\n👁 '+ response.data.videoDetails.viewCount,
                    });
                }).catch(function (error) {
                    return bot.answerCallbackQuery(msg.id,{text: "Видеони юкалшда хатолик юз берди бу видео юкланмайди", show_alert: true});
                });
        }catch(err){
            return bot.answerCallbackQuery(msg.id,{text: "Видеони юкалшда хатолик юз берди бу видео юкланмайди", show_alert: true});
        }
        
    }
    else if(data == 'page' || data == 'no') return
     else {
        try{
            let res = await viweVideos(data)
            res = res[0]
            bot.sendPhoto(chatId,res.imgurl,{
                caption: '🎥 '+res.title + '\n\n⏰ Davomiyligi: ' + res.time_length,
                reply_markup:{
                    inline_keyboard:[
                        [{text:"📣 Youtubeda Ko'rish", url: 'https://youtu.be/' + res.video_id}],
                        [{text:"📥 Yuklab Olish", callback_data: 'down==' + res.video_id}]
                    ]
                }
        })
        }catch(err){
            return bot.answerCallbackQuery(msg.id,{text: "Хатолик юз берди"});
        }
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
    let leng = array[0].length || array[1]?.length ? array[0].length+array[1]?.length : 9
    let txt = `<b>Натижалар ${leng == 10 ? leng * page : res.length} / ${res.length}</b>\n\n`
    txt+=txt1 
    array.push([{text: "⬅️", callback_data: 'prev'},{text: `${page} / ${Math.ceil(res.length/10)}`, callback_data: 'page'},{text: "➡️", callback_data: 'next'}])
    return {txt , array}
}