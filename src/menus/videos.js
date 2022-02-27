const { videocategory, home } = require('../menu.js')
const {selectAudios,selectVideos, update, select, selectSet} = require('../util.js')

const send = async(bot,msg) => {
   
    let u = await selectSet()
    let chatId = msg.chat.id
    let text = msg.text
    let steep = (await select()).find(user => user.user_id == chatId).steep.split(' ')
    if(steep[steep.length - 1] == 'home'){
        if (steep[1] != 'videomenu') steep.push('videomenu'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Видео маърузалар',{
            reply_markup: videocategory
        })
    }
    else if(text == '🔙 Ортга'){
        if (steep.length == 1) return
        let index = steep.indexOf('videomenu')
        console.log(index)
        steep.splice(index-1)
        await update(chatId, steep)
        await menu(steep[steep.length - 1], chatId)
    }
    else if(steep[1] == 'videomenu'){
        if (text == '🕋 Жума маърузалар'){
            if (steep[steep.length - 1] != 'jumaVideo') steep.push('jumaVideo'), await update(chatId, steep)
            let {txt,array} = await rend(1,5, msg)
            if (!txt || !array) return
            bot.sendMessage(chatId, txt,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        }
        else if(text == '🎙 Қисқа маърузалар'){
            if (steep[steep.length - 1] != 'maruzaVideo') steep.push('maruzaVideo'), await update(chatId, steep)
            let {txt,array} = await rend(1,6, msg)
            if (!txt || !array) return
            bot.sendMessage(chatId, txt,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        }
        else if(text == '📖 Илмий суҳбат'){
            if (steep[steep.length - 1] != 'ilmiyVideo') steep.push('ilmiyVideo'), await update(chatId, steep)
            let {txt,array} = await rend(1,7, msg)
            if (!txt || !array) return
            bot.sendMessage(chatId, txt,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        }
        else if(text == '⁉️ Савол-жавоблар'){
            if (steep[steep.length - 1] != 'savolJavob') steep.push('savolJavob'), await update(chatId, steep)
            let {txt,array} = await rend(1,8, msg)
            bot.sendMessage(chatId, txt,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        }
    }
}

const menu = (steep,chatId) => {
    if (steep == 'home'){
        bot.sendMessage(chatId, 'Бош саҳифа',{
            reply_markup:home
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

module.exports = {
    send
}