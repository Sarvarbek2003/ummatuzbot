const {selectAudios, update, insert, select, } = require('../util.js')
const { videocategory, date ,category, adminmenu,updateMenu } = require('../menu.js')

const audiosAdmin = require('../admin/audios.js')
const videosAdmin = require('../admin/videos.js')

let year = ''

module.exports = async(bot, msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    let audios = await selectAudios()
    let steep = (await select()).find(user => user.user_id == chatId).steep.split(' ')
    let st = steep[steep.length - 1]
    if(text == '🎙 Аудио маърузалар'){
        if (steep[steep.length - 1] != 'adminAudio') steep.push('adminAudio'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Аудио маърузалар',{
                reply_markup: category
            })
    }
    else if(text == '🎥 Видео маърузалар' && st == 'admin'){
        if (steep[steep.length - 1] != 'adminVideo') steep.push('adminVideo'), await update(chatId, steep)
        bot.sendMessage(chatId, 'Видео маърузалар',{
                reply_markup: videocategory
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
    else if((st == 'adminJuma' || st == 'adminMaruza' || st == 'sendFoydali' || st == 'adminFoydali') && text == '🔙 Ортга'){
        steep.splice(steep.length-1, 1)
        await menu(bot,steep,chatId)
        await update(chatId, steep)
    }
    else if(st == 'adminAudio'){
        if((st == 'adminJuma' || st == 'adminMaruza' || 'adminAudio') && text == '🔙 Ортга'){
            steep.splice(steep.length-1, 1)
            await menu(bot,steep,chatId)
            await update(chatId, steep)
        }
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
            if (steep[steep.length - 1] != 'sendIlmiy') steep.push('sendIlmiy'), await update(chatId, steep)
            let categ = render(audios,3)
            bot.sendMessage(chatId, 'Илмий суҳбат аудио юборинг',{
                reply_markup: {
                    resize_keyboard:true,
                    keyboard: categ
                }
            })
        }
        else if(text == '🗂 Фойдали дарслар'){
            if (steep[steep.length - 1] != 'adminFoydali') steep.push('adminFoydali'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Фойдали дарсларни қўшиш учун плайлист линкини юборинг',{
                reply_markup: updateMenu
            })
        }
    }
    else if(st == 'adminJuma' || steep[4] == 'sendAudio'){
        if (!steep.includes('sendAudio')) steep.push('sendAudio'), await update(chatId, steep), year = msg.text
        audiosAdmin.juma(bot,msg,year)
    }
    else if(st == 'adminMaruza' || steep[4] == 'sendMaruza'){
        if (!steep.includes('sendMaruza')) steep.push('sendMaruza'), await update(chatId, steep), year = msg.text
        audiosAdmin.maruza(bot,msg,year)
    }
    else if(st == 'sendIlmiy' || steep[4] == 'sendTitle'){
        if (!steep.includes('sendIlmiy')) steep.push('sendIlmiy'), await update(chatId, steep)
        audiosAdmin.ilmiy(bot,msg)
    }
    else if(st == 'adminFoydali' || steep[4] == 'sendFoydali'){
        if(
            !(text.startsWith('https://www.youtube.com/watch?v=') && text.split('=')[2]) &&  
            !(text.startsWith('https://youtube.com/playlist?list=') && text.split('=')[1]) 
        ){
            if(text != "♻️ Янгилаш" && text != "❌ Ўчириш") return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        }  

        // if (!steep.includes('sendFoydali')) steep.push('sendFoydali'), await update(chatId, steep)
        audiosAdmin.foydali(bot,msg)
    }
    else if((st == 'adminVideo' || st == 'videoJuma' || st == 'videoMaruza' || st == 'videoIlmiy' || st == 'videoSavol') && text == '🔙 Ортга'){
        steep.splice(steep.length-1, 1)
        await menu(bot,steep,chatId)
        await update(chatId, steep)
    }
    else if(st == 'adminVideo'){
        if (text == '🕋 Жума маърузалар'){
            if (steep[steep.length - 1] != 'videoJuma') steep.push('videoJuma'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Фойдали дарсларни қўшиш учун плайлист линкини юборинг',{
                reply_markup: updateMenu
            })
        }
        else if(text == '🎙 Қисқа маърузалар'){
            if (steep[steep.length - 1] != 'videoMaruza') steep.push('videoMaruza'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Фойдали дарсларни қўшиш учун плайлист линкини юборинг',{
                reply_markup: updateMenu
            })
        }
        else if(text == '📖 Илмий суҳбат'){
            if (steep[steep.length - 1] != 'videoIlmiy') steep.push('videoIlmiy'), await update(chatId, steep)
            let categ = render(audios,3)
            bot.sendMessage(chatId, 'Фойдали дарсларни қўшиш учун плайлист линкини юборинг',{
                reply_markup: updateMenu
            })
        }
        else if(text == '⁉️ Савол-жавоблар'){
            if (steep[steep.length - 1] != 'videoSavol') steep.push('videoSavol'), await update(chatId, steep)
            bot.sendMessage(chatId, 'Фойдали дарсларни қўшиш учун плайлист линкини юборинг',{
                reply_markup: updateMenu
            })
        } 
    }
    else if(st == 'videoJuma'){
        if(
            !(text.startsWith('https://www.youtube.com/watch?v=') && text.split('=')[2]) &&  
            !(text.startsWith('https://youtube.com/playlist?list=') && text.split('=')[1]) 
        ){
            if(text != "♻️ Янгилаш" && text != "❌ Ўчириш") return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        } 
        videosAdmin.juma(bot, msg)
    }
    else if(st == 'videoMaruza'){
        if(
            !(text.startsWith('https://www.youtube.com/watch?v=') && text.split('=')[2]) &&  
            !(text.startsWith('https://youtube.com/playlist?list=') && text.split('=')[1]) 
        ){
            if(text != "♻️ Янгилаш" && text != "❌ Ўчириш") return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        } 
        videosAdmin.maruza(bot, msg)
    }
    else if(st == 'videoIlmiy'){
        if(
            !(text.startsWith('https://www.youtube.com/watch?v=') && text.split('=')[2]) &&  
            !(text.startsWith('https://youtube.com/playlist?list=') && text.split('=')[1]) 
        ){
            if(text != "♻️ Янгилаш" && text != "❌ Ўчириш") return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        } 
        videosAdmin.ilmiy(bot, msg)
    }
    else if(st == 'videoSavol'){
        if(
            !(text.startsWith('https://www.youtube.com/watch?v=') && text.split('=')[2]) &&  
            !(text.startsWith('https://youtube.com/playlist?list=') && text.split('=')[1]) 
        ){
            if(text != "♻️ Янгилаш" && text != "❌ Ўчириш") return bot.sendMessage(chatId, "Нотўгри линк юбордингиз\nлинкни текшириб қайта юборинг")
        } 
        videosAdmin.savol(bot, msg)
    }
}
    
const menu = (bot,steep,chatId) => {
    if(['adminIlmiy','adminAudio','sendMaruza'].includes(steep[steep.length - 1])){
        bot.sendMessage(chatId, 'Аудио маърузалар',{
            reply_markup:category
        })
    }
    else if(steep[steep.length - 1] == 'admin'){
        bot.sendMessage(chatId,'Админ сахифаси',{
            reply_markup:adminmenu
        })
    }
    else if(steep[steep.length - 1] == 'adminVideo'){
        bot.sendMessage(chatId,'Видео маърузалар сахифаси',{
            reply_markup:videocategory
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
