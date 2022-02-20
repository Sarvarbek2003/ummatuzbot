const { category, date, cancel } = require('../menu.js')
const data = require('../middleweares/model.js')


const send = async(bot,msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId).steep.split(' ')
    if(steep[steep.length - 1] == 'home'){
        if (steep[1] != 'audiomenu') steep.push('audiomenu'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Аудио марузалар',{
            reply_markup: category
        })
    }
    else if(steep[steep.length - 1] == 'audiomenu'){
        if (text == '🕋 Жума марузалари'){
            if (steep[steep.length - 1] != 'juma') steep.push('juma'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Жума марузалари, йилни танланг 👇', {
                reply_markup: date
            })
        }
        else if(text == '🎙 Қисқа марузалар'){
            if (steep[steep.length - 1] != 'maruza') steep.push('maruza'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Марузалар топлами, йилни танланг 👇', {
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
            let { link, info, date } = audio(audios, 1, msg.text)
            bot.sendAudio(chatId, link,{
                caption: `${info}\n\n📆${date}-yil\n\n🎙 Қисқа марузалар\n\n👉 @ummatuz`
            })
            return
        }

        if(!['2016','2017','2018','2019','2020','2021','2022'].includes(`${msg.text}`) || steep[steep.length - 1] == 'jumadate') return
        steep.push('jumadate'), await update(chatId, steep)
        bot.sendMessage(chatId, `${msg.text}-йилги марузалар тўплами`,{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text)
            }
        })
    }
    else if(steep[steep.length - 1] == 'maruza' || steep[steep.length-1] == 'maruzadate'){
        if(steep[steep.length - 1] == 'maruzadate'){
            let { link, info, date } = audio(audios, 2, msg.text)
            if(!link || !info || !date) return
            bot.sendAudio(chatId, link,{
                caption: `${info}\n\n📆${date}-yil\n\n🎙 Қисқа марузалар\n\n👉 @ummatuz`
            })
            return
        }
        
        if(!['2016','2017','2018','2019','2020','2021','2022'].includes(`${msg.text}`) || steep[steep.length - 1] == 'maruzadate') return
        steep.push('maruzadate'), await update(chatId, steep)
        bot.sendMessage(chatId, `${msg.text}-йилги марузалар тўплами`,{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
    }
    else if(steep[steep.length - 1] == 'ilmiy'){
        let { link, info, date } = audio(audios, 2, msg.text) 
            if(!link || !info || !date) return
            bot.sendAudio(chatId, link,{
                caption: `${info}\n\n📆${date}-yil\n\n🎙 Қисқа марузалар\n\n👉 @ummatuz`
            })
    }
}




const select = async() => {
    const users = await data(`
        select 
            *
        from users
    `)
    return users 
}

const selectAudios = async() => {
    const audios = await data(`
        select 
            *
        from audios
    `)
    return audios 
}


const update = async(userId, array) => {
    let steep = array.join(' ')
    await data(`
        update users set steep = $2 where user_id = $1
    `,userId,steep)
}

const render = (arr, cat, date) => {
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
    arr1.push({text: '🔙 Ортга'})
    array.push(arr1)
    return array
}

const audio = (arr, cat, title)  => {
    let obj = arr.find(el => el.category == cat && el.title == title)
    return obj || {link: undefined, info: undefined, date: undefined}
}


module.exports = {
    send
}