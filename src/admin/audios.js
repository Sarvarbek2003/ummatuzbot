const { cancel, inline , date, category} = require('../menu.js')
const { playlist,yutubeApi, selectAudios, deletePlaylist, update, select, selectPlaylist, insertAudio,selectSet } = require('../util.js')

let link = ''
let uid = ''
let size = ''
let title = ''
let info = ''

const juma = async(bot, msg, year) => {
    const chatId = msg.chat.id;
    const text = msg.text

    let u = await selectSet()

    let audios = await selectAudios()
    let aud = ren(audios,1,year)

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length - 1]

    if(text == '🔙 Ортга' && steep[1] == 'admin'){
        steep.splice(steep.length-1, 1)
        await menu(bot,steep,chatId)
        await update(chatId, steep)
    } 
    else if (st == 'sendAudio' && msg.audio){
        bot.sendMessage(chatId, "Мавзуни ёзинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        if (steep[steep.length - 1] != 'sendTitle') steep.push('sendTitle'), await update(chatId, steep)
        uid = msg.audio.file_unique_id
        link = msg.audio.file_id
        size = (msg.audio.file_size / 1024 / 1024).toFixed(2)
    }
    else if(st == 'sendTitle'){
        if (steep[steep.length - 1] != 'sendInfo') steep.push('sendInfo'), await update(chatId, steep)
        bot.sendMessage(chatId,'Қисқача изоҳ',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        title = '📖' + text
    }
    else if(st == 'sendInfo'){
        info = '🔖' + text
        await insertAudio(uid,year, link, size, title, info,1)
        bot.sendMessage(chatId,'✅Мувоффақятли жойланди\n\n🔄Ушбу йил учун яна аудио жойламоқчи бўлсангиз аудио юборинг!',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        let index = steep.indexOf(st) 
        steep.splice(index - 1)
        await update(chatId, steep)
    }
    else if(aud.includes(text)){
        let { link, info, date, size} = audio(audios, 1, msg.text)
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n🕋 Жума маърузалар\n💽 Hajmi: ${size}MB\n\n${info}\n👉 @${u.telegram}`,
                reply_markup : inline
            })
    }
    else {
        bot.sendMessage(chatId,"Марҳамат аудио юборинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 1, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
    }
}

const maruza = async(bot, msg, year) => {
    const chatId = msg.chat.id;
    const text = msg.text

    let u = await selectSet()

    let audios = await selectAudios()
    let aud = ren(audios,2,year)

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length - 1]

    if(text == '🔙 Ортга' && steep[1] == 'admin'){
        steep.splice(steep.length-1, 1)
        await menu(bot,steep,chatId)
        await update(chatId, steep)
    } 
    else if (st == 'sendMaruza' && msg.audio){
        bot.sendMessage(chatId, "Мавзуни ёзинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        if (steep[steep.length - 1] != 'sendTitle') steep.push('sendTitle'), await update(chatId, steep)
        uid = msg.audio.file_unique_id
        link = msg.audio.file_id
        size = (msg.audio.file_size / 1024 / 1024).toFixed(2)
    }
    else if(st == 'sendTitle'){
        if (steep[steep.length - 1] != 'sendInfo') steep.push('sendInfo'), await update(chatId, steep)
        bot.sendMessage(chatId,'Қисқача изоҳ',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        title = '📖' + text
    }
    else if(st == 'sendInfo'){
        info = '🔖' + text
        await insertAudio(uid,year, link, size, title, info,2)
        bot.sendMessage(chatId,'✅Мувоффақятли жойланди\n\n🔄Ушбу йил учун яна аудио жойламоқчи бўлсангиз аудио юборинг!',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        let index = steep.indexOf(st) 
        steep.splice(index - 1)
        await update(chatId, steep)
    }
    else if(aud.includes(text)){
        let { link, info, date, size} = audio(audios, 2, msg.text)
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n🎙 Қисқа маърузалар\n💽 Hajmi: ${size}MB\n\n${info}\n👉 @${u.telegram}`,
                reply_markup : inline
            })
    }
    else {
        bot.sendMessage(chatId,"Марҳамат аудио юборинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 2, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
    }
}

const ilmiy = async(bot, msg, year = '2022') => {
    const chatId = msg.chat.id;
    const text = msg.text

    let u = await selectSet()

    let audios = await selectAudios()
    let aud = ren(audios,3)

    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    let st = steep[steep.length - 1]

    if(text == '🔙 Ортга' && steep[1] == 'admin'){
        steep.splice(steep.length-1, 1)
        await menu(bot,steep,chatId)
        await update(chatId, steep)
    } 
    else if (st == 'sendIlmiy' && msg.audio){
        bot.sendMessage(chatId, "Мавзуни ёзинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 3, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        if (steep[steep.length - 1] != 'sendTitle') steep.push('sendTitle'), await update(chatId, steep)
        uid = msg.audio.file_unique_id
        link = msg.audio.file_id
        size = (msg.audio.file_size / 1024 / 1024).toFixed(2)
    }
    else if(st == 'sendTitle'){
        if (steep[steep.length - 1] != 'sendInfo') steep.push('sendInfo'), await update(chatId, steep)
        bot.sendMessage(chatId,'Қисқача изоҳ',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 3, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        title = '📖' + text
    }
    else if(st == 'sendInfo'){
        info = '🔖' + text
        await insertAudio(uid,year, link, size, title, info,3)
        bot.sendMessage(chatId,'✅Мувоффақятли жойланди\n\n🔄Ушбу йил учун яна аудио жойламоқчи бўлсангиз аудио юборинг!',{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 3, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
        let index = steep.indexOf(st) 
        steep.splice(index - 1)
        await update(chatId, steep)
    }
    else if(aud.includes(text)){
        let { link, info, date, size} = audio(audios, 3, msg.text)
            if(!link || !info || !date || !size) return
            bot.sendAudio(chatId, link,{
                caption: `📆 ${date}-yil\n📖 Илмий суҳбат\n💽 Hajmi: ${size}MB\n\n${info}\n👉 @${u.telegram}`,
                reply_markup : inline
            })
    }
    else {
        bot.sendMessage(chatId,"Марҳамат аудио юборинг",{
            reply_markup:{
                resize_keyboard: true,
                keyboard: render(audios, 3, msg.text) || [{text: '🔙 Ортга'}]
            }
        })
    }
}

const foydali = async(bot, msg) => {
    const chatId = msg.chat.id;
    try {
        const text = msg.text
        let playList

        let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')

        if(text == "♻️ Янгилаш") {
            playList =  await selectPlaylist('4')
        }
        else if(text == "❌ Ўчириш"){
            await deletePlaylist('4')
            return bot.sendMessage(chatId, "❎ Ўчирилди")
        }
        else {
            playList = text.split('=')[text.split('=').length-1]
        }
        if(playList == '' || playList == undefined) return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")

        await yutubeApi(playList)
        await playlist('4',playList)

        steep.pop()
        await update(chatId, steep)
        
        bot.sendMessage(chatId, "✅ Бажарилди",{
            reply_markup:category
        })
    }catch (err){
        bot.sendMessage(chatId,'Хатолик қайта уруниб кўринг')
    }
}

const menu = (bot,steep,chatId) => {
    if(steep[steep.length - 1] == 'sendTitle'){
        bot.sendMessage(chatId, 'Мавзуни қайта юборинг',{
            reply_markup:cancel
        })
    }
    else if(steep[steep.length - 1] == 'sendAudio'){
        bot.sendMessage(chatId,'Марҳамат аудиони қайта юборинг',{
            reply_markup:cancel
        })
    }
    else if(steep[steep.length - 1] == 'adminJuma'){
        bot.sendMessage(chatId,'Жума маърузалар йилни танланг',{
            reply_markup:date
        })
    }
    else if(steep[steep.length - 1] == 'adminMaruza'){
        bot.sendMessage(chatId,'Қисқа марузалар йилни танланг',{
            reply_markup:date
        })
    }
    else if(steep[steep.length - 1] == 'adminAudio'){
        bot.sendMessage(chatId,'Audo',{
            reply_markup:category
        })
    }
}

const ren = (arr, cat, date = '2022') => {
    let array = []
    arr.map(el => {
        if (el.date == date && el.category == cat){
            array.push(el.title)
        }
    })
    return array
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
    array.push(arr1)
    array.unshift([{text: '🔙 Ортга'}])
    return array
}

const audio = (arr, cat, title)  => {
    let obj = arr.find(el => el.category == cat && el.title == title)
    return obj || {link: undefined, info: undefined, date: undefined}
}

module.exports = {
    foydali,
    maruza,
    ilmiy,
    juma
}