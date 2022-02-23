const { category, date, cancel } = require('../menu.js')
const {selectAudios, update, insert, select, selectSet} = require('../util.js')

const send = async(bot,msg) => {
    let u = await selectSet()
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId).steep.split(' ')
    if(steep[steep.length - 1] == 'home'){
        if (steep[1] != 'audiomenu') steep.push('audiomenu'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup: category
        })
    }
    else if(steep[steep.length - 1] == 'audiomenu'){
        if (text == '🕋 Жума маърузалар'){
            if (steep[steep.length - 1] != 'juma') steep.push('juma'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Жума маърузалар, йилни танланг 👇', {
                reply_markup: date
            })
        }
        else if(text == '🎙 Қисқа маърузалар'){
            if (steep[steep.length - 1] != 'maruza') steep.push('maruza'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Маърузалар тўплами, йилни танланг 👇', {
                reply_markup: date
            })
        }
        else if(text == '📖 Илмий суҳбат'){
            if (steep[steep.length - 1] != 'ilmiy') steep.push('ilmiy'), await update(chatId, steep)
            bot.sendMessage(chatId, '📖 Илмий суҳбат', {
                reply_markup:{
                    resize_keyboard: true,
                    keyboard: render(audios, 3, msg.text) || [{text: '🔙 Ортга'}]
                }
            })
        }
        else if(text == '🗂 Фойдали дарслар'){
            if (steep[steep.length - 1] != 'foydali') steep.push('foydali'), await update(chatId, steep)
            bot.sendMessage(chatId, '🗂 Фойдали дарслар', {
                reply_markup: cancel
            })
        }
    }
    else if (steep[steep.length - 1] == 'juma' || steep[steep.length-1] == 'jumadate'){
        if(steep[steep.length - 1] == 'jumadate'){
            let { link, info, date, size} = audio(audios, 1, msg.text)
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n🎙 Жума маърузалар\n💽 Hajmi: ${size}MB\n\n${info}\n👉 @${u.telegram}`
            })
            return
        }

        if(!['2016','2017','2018','2019','2020','2021','2022'].includes(`${msg.text}`) || steep[steep.length - 1] == 'jumadate') return
        steep.push('jumadate'), await update(chatId, steep)
        bot.sendMessage(chatId, `${msg.text}-йилги маърузалар тўплами`,{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text)
            }
        })
    }
    else if(steep[steep.length - 1] == 'maruza' || steep[steep.length-1] == 'maruzadate'){
        if(steep[steep.length - 1] == 'maruzadate'){
            let { link, info, date, size } = audio(audios, 2, msg.text)
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption:`📆 ${date}-yil\n🎙 Қисқа маърузалар\n💽 ${size}MB\n\n${info}\n👉 @${u.telegram}`
            })
            return
        }
        
        if(!['2016','2017','2018','2019','2020','2021','2022'].includes(`${msg.text}`) || steep[steep.length - 1] == 'maruzadate') return
        steep.push('maruzadate'), await update(chatId, steep)
        bot.sendMessage(chatId, `${msg.text}-йилги маърузалар тўплами`,{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
    }
    else if(steep[steep.length - 1] == 'ilmiy'){
        let { link, info, date, size } = audio(audios, 3, msg.text) 
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption: `${info}\n\n📆${date}-yil\n\n🎙 Қисқа маърузалар\n\n👉 @${u.telegram}`
            })
    }
}

const render = (arr = [], cat, date) => {
    let array = []
    let arr1 = []
    let count = 0
    arr.map((el) => {
        if (el.date == date && el.category == cat){
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

const audio = (arr = [], cat, title)  => {
    let obj = arr.find(el => el.category == cat && el.title == title)
    return obj || {link: undefined, info: undefined, date: undefined}
}


module.exports = {
    send
}