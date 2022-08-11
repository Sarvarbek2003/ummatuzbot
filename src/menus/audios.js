const { category, date, cancel} = require('../menu.js')
const {selectAudios,selectVideos, update, select, selectSet} = require('../util.js')

const send = async(bot,msg) => {
    let u = await selectSet()
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    if(steep[steep.length - 1] == 'home'){
        if (steep[1] != 'audiomenu') steep.push('audiomenu'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup: category
        })
    }
    else if(steep[steep.length - 1] == 'audiomenu' || steep[steep.length - 1] == 'foydali'){
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
                    keyboard: render(audios, 3) || [{text: '🔙 Ортга'}]
                }
            })
        }
        else if(text == '💫 Рамазон сухбатлари'){
            if (steep[steep.length - 1] != 'ramazon') steep.push('ramazon'), await update(chatId, steep)
            let {txt,array} = await rend(1,4, msg)
            bot.sendMessage(chatId, txt,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: array
                }
            })
        }
    }
    else if (steep[steep.length - 1] == 'juma' || steep[steep.length-1] == 'jumadate'){
        if(steep[steep.length - 1] == 'jumadate'){
            let { link, info, date, size, title} = audio(audios, 1, msg.text)
            if(!link || !info || !date || !size || !title) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n🎙 Жума маърузалар\n💽 ${size}MB\n\n${title}\nУшбу суҳбатни Youtube орқали кўринг\n👇\n${info}\n\n👉 @${u?.telegram}`
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
            let { link, info, date, size, title } = audio(audios, 2, msg.text)
            if(!link || !info || !date || !size || !title) return
            bot.sendAudio(chatId, link,{
                caption:`📆 ${date}-yil\n🎙 Қисқа маърузалар\n💽 ${size}MB\n\n${title}\nУшбу суҳбатни Youtube орқали кўринг\n👇\n${info}\n\n👉 @${u?.telegram}`
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
        let { link, info, date, size, title } = audio(audios, 3, msg.text) 
            if(!link || !info || !date || !size || !title) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n📖 Илмий суҳбатлар\n💽 ${size}MB\n\n${title}\nУшбу суҳбатни Youtube орқали кўринг\n👇\n${info}\n\n👉 @${u?.telegram}`
            })
    }
    else if(steep[steep.length - 1] == 'ramazon'){
        let { link, info, date, size, title } = audio(audios, 4, msg.text) 
            if(!link || !info || !date || !size || !title) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n💫 Рамазон сухбатлари\n💽 ${size}MB\n\n${title}\nУшбу суҳбатни Youtube орқали кўринг\n👇\n${info}\n\n👉 @${u?.telegram}`
            })

            if(!['2016','2017','2018','2019','2020','2021','2022'].includes(`${msg.text}`) || steep[steep.length - 1] == 'ramazondate') return
            steep.push('ramazondate'), await update(chatId, steep)
            bot.sendMessage(chatId, `${msg.text}-йилги маърузалар тўплами`,{
                reply_markup:{
                    resize_keyboard: true,
                    keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
                }
            })
    }
}

const render = (arr = [], cat, date = "2022") => {
    let array = []
    let arr1 = []
    let count = 0
    arr.map((el) => {
        if (el.date == (date || true) && el.category == cat){
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

// const rends = async(page = 1,category) => {
//     if(page < 1) return 'error'
//     let res = await selectVideos(category)
//     if (res.length == 0) return {txt: "Хозирча контент йўқ", array: [[{text: "❎", callback_data: 'no'}]]}
//     if(page > Math.ceil(res.length/10)) return 'error1'
//     let limit = 10
//     let videos = res.slice(page * limit - limit, limit * page)
//     let count = 0  
//     let array = []
//     let arr = []
//     let txt = `<b>Натижалар ${page*10} / ${res.length}</b>\n\n`  
//     videos.map((el,index) => {
//         txt+=`<b>${index + 1}</b>). ` + el.title + ' | ' + el.time_length + '\n➖➖➖➖➖➖➖➖➖\n'
//         if(count < 5){
//             arr.push({text: index+1, callback_data: el.video_id})
//             count++
//         }else{
//             array.push(arr)
//             arr = []
//             count = 1
//             arr.push({text: index+1, callback_data: el.video_id})
//         }
//     })
//     array.push(arr)
//     array.push([{text: "⬅️", callback_data: 'prev'},{text: `${page} / ${Math.ceil(res.length/10)}`, callback_data: 'page'},{text: "➡️", callback_data: 'next'}])
//     return {txt , array}
// }

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

const audio = (arr = [], cat, title)  => {
    let obj = arr.find(el => el.category == cat && el.title == title)
    console.log(obj);
    return obj || {link: undefined, info: undefined, date: undefined, title: undefined}
}


module.exports = {
    send
}