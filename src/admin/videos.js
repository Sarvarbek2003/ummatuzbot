const { videocategory } = require('../menu.js')
const { playlist,yutubeApi, deletePlaylist, select, selectPlaylist,update} = require('../util.js')

const juma = async(bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text
    let playList
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    try{
        if(text == "♻️ Янгилаш") {
            playList =  await selectPlaylist('5') 
        }
        else if(text == "❌ Ўчириш"){
            await deletePlaylist('5')
            return bot.sendMessage(chatId, "❎ Ўчирилди")
        }
        else {
            playList = text.split('=')[text.split('=').length-1]
        }
        
        if(playList == '' || playList == undefined) return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        
        await yutubeApi(playList)
        await playlist('5',playList)

        steep.pop()
        await update(chatId, steep)

        bot.sendMessage(chatId, "✅ Бажарилди",{
            reply_markup:videocategory
        })
    }catch(err){
        bot.sendMessage(chatId, "Хатолик қайта уруниб кўринг")
    }
}

const maruza = async(bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text
    let playList
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    try{

        if(text == "♻️ Янгилаш") {
            playList =  await selectPlaylist('6') 
        }
        else if(text == "❌ Ўчириш"){
            await deletePlaylist('6')
            return bot.sendMessage(chatId, "❎ Ўчирилди")
        }
        else {
            playList = text.split('=')[text.split('=').length-1]
        }
        
        if(playList == '' || playList == undefined) return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        
        await yutubeApi(playList)
        await playlist('6',playList)

        steep.pop()
        await update(chatId, steep)

        bot.sendMessage(chatId, "✅ Бажарилди",{
            reply_markup:videocategory
        })
    }catch(err){
        bot.sendMessage(chatId, "Хатолик қайта уруниб кўринг")
    }
}

const ilmiy = async(bot, msg) => {
    const chatId = msg.chat.id;
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    try{
        const text = msg.text
        let playList

        if(text == "♻️ Янгилаш") {
            playList =  await selectPlaylist('7') 
        }
        else if(text == "❌ Ўчириш"){
            await deletePlaylist('7')
            return bot.sendMessage(chatId, "❎ Ўчирилди")
        }
        else {
            playList = text.split('=')[text.split('=').length-1]
        }
        
        if(playList == '' || playList == undefined) return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        
        await yutubeApi(playList)
        await playlist('7',playList)

        steep.pop()
        await update(chatId, steep)

        bot.sendMessage(chatId, "✅ Бажарилди",{
            reply_markup:videocategory
        })
    }catch(err){
        bot.sendMessage(chatId, "Хатолик қайта уруниб кўринг")
    }
}

const savol = async(bot, msg) => {
    const chatId = msg.chat.id;
    let steep = (await select()).find(user => user.user_id == chatId)?.steep.split(' ')
    try{
        const text = msg.text
        let playList
        if(text == "♻️ Янгилаш") {
            playList =  await selectPlaylist('8') 
        }
        else if(text == "❌ Ўчириш"){
            await deletePlaylist('8')
            return bot.sendMessage(chatId, "❎ Ўчирилди")
        }
        else {
            playList = text.split('=')[text.split('=').length-1]
        }
        
        if(playList == '' || playList == undefined) return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        
        await yutubeApi(playList)
        await playlist('8',playList)

        steep.pop()
        await update(chatId, steep)

        bot.sendMessage(chatId, "✅ Бажарилди",{
            reply_markup:videocategory
        })
    }catch(err){
        bot.sendMessage(chatId, "Хатолик қайта уруниб кўринг")
    }
}

module.exports = {
    maruza,
    ilmiy,
    savol,
    juma
}