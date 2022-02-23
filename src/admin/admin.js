const {selectAudios, update, insert, select, } = require('../util.js')
const { home, date ,category, adminmenu } = require('../menu.js')

const audiosAdmin = require('../admin/audios.js')
const videosAdmin = require('../admin/videos.js')

let year = ''

module.exports = async(bot, msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length - 1]
    if(text == '🎙 Аудио маърузалар' && st == 'admin'){
        if (steep[steep.length - 1] != 'adminAudio') steep.push('adminAudio'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Аудио маърузалар',{
                reply_markup: category
            })
        }
    else if(text == '🎥 Видео маърузалар' && st == 'admin'){
        if (steep[steep.length - 1] != 'adminVideo') steep.push('adminVideo'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Видео маърузалар',{
                reply_markup: category
            })
        
    }
    else if(text == '⁉️ Савол-жавоб'){
        if (steep[steep.length - 1] != 'adminJavob') steep.push('adminJavob'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Савол-жавоб',{
                reply_markup: category
            })
    }
    else if(text == '❓ Савол бериш'){
        if (steep[steep.length - 1] != 'adminSavol') steep.push('adminSavol'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Савол-жавоб',{
                reply_markup: category
            })
    }
    else if(st == 'adminAudio'){
        if (text == '🕋 Жума маърузалар'){
            if (steep[steep.length - 1] != 'adminJuma') steep.push('adminJuma'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Жума маърузалар',{
                reply_markup: date
            })
        }
        else if(text == '🎙 Қисқа маърузалар'){
            if (steep[steep.length - 1] != 'adminMaruza') steep.push('adminMaruza'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Қисқа маърузалар',{
                reply_markup: date
            })
        }
        else if(text == '📖 Илмий суҳбат'){
            if (steep[steep.length - 1] != 'adminIlmiy') steep.push('adminIlmiy'), await update(chatId, steep)
            let categ = render(audios,3)
            bot.sendMessage(chatId, 'Қисқа маърузалар',{
                reply_markup: {
                    resize_keyboard:true,
                    keyboard: categ
                }
            })
        }
        else if(text == '🗂 Фойдали дарслар'){
            if (steep[steep.length - 1] != 'adminFoydali') steep.push('adminFoydali'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Қисқа маърузалар',{
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: categ
                }
            })
        }
    }
    else if((st == 'adminJuma' || st == 'adminMaruza') && text == '🔙 Ортга'){
        steep.splice(steep.length-1, 1)
        menu(bot,steep,chatId)
        await update(chatId, steep)
    }
    else if(st == 'adminJuma' || steep[4] == 'sendAudio'){
        if (!steep.includes('sendAudio')) steep.push('sendAudio'), await update(chatId, steep), year = msg.text
        audiosAdmin.juma(bot,msg,year)
    }
    else if(st == 'adminMaruza' || steep[4] == 'sendMaruza'){
        if (!steep.includes('sendMaruza')) steep.push('sendMaruza'), await update(chatId, steep), year = msg.text
        audiosAdmin.maruza(bot,msg,year)
    }
    else if(st == 'adminIlmiy' || steep[4] == 'sendIlmiy'){
        if (!steep.includes('sendIlmiy')) steep.push('sendIlmiy'), await update(chatId, steep), year = msg.text
        audiosAdmin.ilmiy(bot,msg,year)
    }
    else if(st == 'adminFoydali' || steep[4] == 'sendFoydali'){
        if (!steep.includes('sendFoydali')) steep.push('sendFoydali'), await update(chatId, steep), year = msg.text
        audiosAdmin.maruza(bot,msg,year)
    }
}
    
const menu = (bot,steep,chatId) => {
    if(['adminIlmiy','adminFoydali','adminAudio','sendMaruza'].includes(steep[steep.length - 1])){
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup:category
        })
    }
    else if(steep[steep.length - 1] == 'admin'){
        bot.sendMessage(chatId,'Админ сахифаси',{
            reply_markup:adminmenu
        })
    }
}

const  render = (arr, cat) => {
    let array = []
    let arr1 = []
    let count = 0
    arr.map((el) => {
        if (el.category == cat){
            let obj = {text: el.title}
            if(count < 2){
                arr1.push(obj)
                count++     
            }else if (count == 2){
                array.push(arr1)
                arr1 = []
                count = 1
                arr1.push(obj)
            }   
        }
    })
    array.push(arr1)
    array.push([{text: '🔙 Ортга'}])
    return array
}
