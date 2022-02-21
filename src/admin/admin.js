const {selectAudios, update, insert, select, } = require('../util.js')
const { home, date ,category, adminmenu } = require('../menu.js')

const audiosAdmin = require('../admin/audios.js')
const videosAdmin = require('../admin/videos.js')

let year = ''

module.exports = async(bot, msg) => {
    let chatId = msg.chat.id
    let text = msg.text
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
        if (text == '🕋 Жума маърузалар' ){
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
        else if(text == '📖 Илмий суҳба'){
            if (steep[steep.length - 1] != 'adminIlmiy') steep.push('adminIlmiy'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Қисқа маърузалар',{
                reply_markup: date
            })
        }
        else if(text == '🗂 Фойдали дарслар'){
            if (steep[steep.length - 1] != 'adminFoydali') steep.push('adminFoydali'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Қисқа маърузалар',{
                reply_markup: date
            })
        }
    }
    else if(st == 'adminJuma' || steep[4] == 'sendAudio'){
        if (!steep.includes('sendAudio')) steep.push('sendAudio'), await update(chatId, steep), year = msg.text
        audiosAdmin(bot,msg,year)
    }
    
    
}
    
