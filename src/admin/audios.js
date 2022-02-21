const { cancel, otmen } = require('../menu.js')
const { update, select, insertAudio } = require('../util.js')

let link = ''
let size = ''
let title = ''
let info = ''

module.exports = async(bot, msg, year) => {
    let admins = (await select()).map(user => user.is_admin == true ? +user.user_id : [])

    const chatId = msg.chat.id;
    const text = msg.text

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length - 1]

    if (st == 'sendAudio' && msg.audio){
        bot.sendMessage(chatId, "Мавзуни ёзинг",{
            reply_markup: otmen
        })
        if (steep[steep.length - 1] != 'sendTitle') steep.push('sendTitle'), await update(chatId, steep)
        link = msg.audio.file_id
        size = (msg.audio.file_size / 1024 / 1024).toFixed(3)
    }
    else if(st == 'sendTitle'){
        if (steep[steep.length - 1] != 'sendInfo') steep.push('sendInfo'), await update(chatId, steep)
        bot.sendMessage(chatId,'Қисқача изоҳ',{
            reply_markup:otmen
        })
        title = '📖' + text
    }
    else if(st == 'sendInfo'){
        info = '🔖' + text
        await insertAudio(year, link, size, title, info,1)
        bot.sendMessage(chatId,'✅Мувоффақятли жойланди\n\n🔄Ушбу йил учун яна аудио жойламоқчи бўлсангиз аудио юборинг!',{
            reply_markup:otmen
        })
        let index = steep.indexOf(st) 
        steep.splice(index - 1)
        await update(chatId, steep)
    }
    else bot.sendMessage(chatId,"Марҳамат аудио юборинг")
    

}