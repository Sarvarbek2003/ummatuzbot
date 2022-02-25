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

const updateMenu = {
    resize_keyboard: true,
    keyboard:[
        [{text: "♻️ Янгилаш"}],
        [{text: "🔙 Ортга"}]
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

const videosInline = {
    inline_keyboard:[
        [{text: "1", callback_data: 'xt8ENy9UshM'},{text: "2", callback_data: 'ZrH1_evRfLQ'},{text: "3", callback_data: 'OUS5Vnt7-C8'},{text: "4", callback_data: 'Nu0WXUjq3Y0'},{text: "5", callback_data: 'oM5OVkETF4M'}],
        [{text: "6", callback_data: 'M9wZrQ_1zwA'},{text: "7", callback_data: 'CXhGpRsOv4c'},{text: "8", callback_data: 'oM5OVkETF4M'},{text: "9", callback_data: 'lSk_2JnkWHU'},{text: "10", callback_data: 'GzTc41htnNM'}],
        [{text: "⬅️", callback_data: 'prev'},{text: "1/2", callback_data: 'page'},{text: "➡️", callback_data: 'next'}]
    ]
}

module.exports = {
    videosInline,
    updateMenu,
    adminmenu,
    category,
    cancel,
    inline,
    home,
    date
}