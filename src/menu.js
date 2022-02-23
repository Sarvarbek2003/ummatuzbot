const date = {
    resize_keyboard: true,
    keyboard:[
        [{text: "2016"},{text: "2017"},{text: "2018"}],
        [{text: "2019"},{text: "2020"},{text: "2021"}],
        [{text: "2022"}],
        [{text: "🔙 Ортга"}]
    ]
}

const category = {
    resize_keyboard: true,
    keyboard:[
        [{text: "🕋 Жума маърузалар"},{text: "🎙 Қисқа маърузалар"}],
        [{text: "📖 Илмий суҳбат"},{text: "🗂 Фойдали дарслар"}],
        [{text: "🔙 Ортга"}]
    ]
}

const cancel = {
    resize_keyboard: true,
    keyboard:[
        [{text: "🔙 Ортга"}]
    ]
}

const otmen = {
    resize_keyboard: true,
    keyboard:[
        [{text: "❌ Бекор қилиш"}]
    ]
}

const home = { 
    resize_keyboard: true,
    keyboard: [
        [{text: "🎙 Аудио маърузалар"},{text:"🎥 Видео маърузалар"}],
        [{text: "⁉️ Савол-жавоб"},{text:"❓ Савол бериш"}]
    ]
}

const adminmenu = { 
    resize_keyboard: true,
    keyboard: [
        [{text: "🎙 Аудио маърузалар"},{text:"🎥 Видео маърузалар"}],
        [{text: "⁉️ Савол-жавоб"},{text:"❓ Савол бериш"}],
        [{text: "📨 Хабар юбориш"},{text:"📩 Форwард хабар"}],
        [{text: "📊 Статистика"},{text:"⚙️ Созламалар"}]
    ]
}

const inline = {
    inline_keyboard:[
        [{text: "❌ Delete", callback_data: 'del'}]
    ]
}

module.exports = {
    adminmenu,
    category,
    cancel,
    inline,
    otmen,
    home,
    date
}