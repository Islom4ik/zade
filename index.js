const { Scenes, session, Telegraf, Markup } = require('telegraf');
const { collection, ObjectId } = require('./additions/db');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const { DateTime } = require('luxon');
const { enter, leave } = Scenes.Stage;

const nameget = new Scenes.BaseScene("nameget");

nameget.enter(async ctx => {
    try {
        return await ctx.reply('👨🏻‍💻 Introduce yourself, write your real name:')
    } catch (e) {
        console.error(e);
    }
})

nameget.on('text', async ctx => {
    try {
        const searchString = /[\!\#\_\№\"\;\$\%\^\:\&\?\*\(\)\{\}\[\]\?\/\,.\\\|\/\+\=\d]+/g;
        if (ctx.message.text.match(searchString)) return await ctx.reply('👨🏻‍💻 Please enter your real name:');
        const load = await ctx.reply('👨🏻‍💻 Noting...')
        await collection.insertOne({
            realname: ctx.message.text,
            username: ctx.from.username || 'none',
            accfirstname: ctx.from.first_name,
            user_id: ctx.from.id,
            conver: []
        })
        await ctx.deleteMessage(load.message_id);
        await ctx.reply(`👨🏻‍💻 Success! Hello ${ctx.message.text}`);
        return await ctx.scene.leave('nameget')
    } catch (e) {
        console.error(e);
    }
})

nameget.leave(async ctx => {
    try {
        return await ctx.reply('👨🏻‍💻 You can now send me messages to forward.')
    } catch (e) {1334751749
        console.error(e);
    }
})

const news = new Scenes.BaseScene("news");

news.enter(async ctx => {
    try {
        await ctx.reply('Ok... Send me any message:', {reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})

news.on('message', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {remove_keyboard: true}})
            return await ctx.scene.leave('news')
        }
        await ctx.reply('Working on it...', {reply_markup: {remove_keyboard: true}})
        const quat = await ctx.reply('✴️ Are you sure to send this message to all users of your bot?\n(If you want to change the message, before clicking on the button copy your message!)', {reply_markup: {inline_keyboard: [[Markup.button.callback('Yes 🟢', 'newssend'), Markup.button.callback('No, i want to edit 🔴', 'newscancsend')]]}})
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$set: {msgid: ctx.message.message_id, qm: quat.message_id}})
    } catch (e) {
        console.error(e);
    }
})

news.action('newscancsend', async ctx => {
    try {
        const admdb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        await ctx.deleteMessage(admdb.msgid)
        await ctx.deleteMessage(admdb.qm)
        await ctx.scene.enter('news')
    } catch (e) {
        console.error(e);
    }
})

news.action('newssend', async ctx => {
    try {
        const admdb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        await ctx.deleteMessage(admdb.qm)
        await ctx.reply('Sending...')
        for (let i = 0; i < admdb.users.length; i++) {
            try {
                await ctx.tg.copyMessage(admdb.users[i], ctx.chat.id, admdb.msgid)
            } catch (e) {
                console.error(e);
            }
        }
        await ctx.reply('Sending completed ✅')
        await ctx.scene.leave('news')
    } catch (e) {
        console.error(e);
    }
})

const groupanalyse = new Scenes.BaseScene("groupanalyse");

groupanalyse.enter(async ctx => {
    try {
        await ctx.replyWithPhoto({source: './zadasc.jpg'}, {caption: 'Choose your group:', reply_markup: {inline_keyboard: [[Markup.button.callback('Groots 🌴', 'g1'), Markup.button.callback('Groots 🌴🌴', 'g2')], [Markup.button.callback('Cancel ⛔️', 'cancgr')]]}})
    } catch (e) {
        console.error(e);
    }
})

groupanalyse.action('g1', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gfgp')
    } catch (e) {
        console.error(e);
    }
})

groupanalyse.action('g2', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gsgp')
    } catch (e) {
        console.error(e);
    }
})

groupanalyse.action('cancgr', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.reply('Canceled ✅')
        await ctx.scene.leave('groupanalyse')
    } catch (e) {
        console.error(e);
    }
})

const gfgp = new Scenes.BaseScene("gfgp");

gfgp.enter(async ctx => {
    try {
        await ctx.reply('👨🏻‍💻 Enter the password to join the group number 1:', {reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})

gfgp.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {remove_keyboard: true}})
            await ctx.scene.leave('gfgp')
        } else {
            const passwords = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        
            if(ctx.message.text == passwords.g1p) {
                await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$push: {fgroup: ctx.from.id}})
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {gr: 1, hws: passwords.fgroop_hw}})
                await ctx.reply('Success! You have successfully joined the group number 1 ✅', {reply_markup: {remove_keyboard: true}})
                await ctx.scene.leave('gfgp')
            }else {
                await ctx.reply('Incorrect password ⚠️')
                await ctx.scene.enter('gfgp')
            }
        }
    } catch (e) {
        console.error(e);
    }
})

const gsgp = new Scenes.BaseScene("gsgp");

gsgp.enter(async ctx => {
    try {
        await ctx.reply('👨🏻‍💻 Enter the password to join the group number 2:', {reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})

gsgp.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {remove_keyboard: true}})
            await ctx.scene.leave('gsgp')
        } else {
            const passwords = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})

            if(ctx.message.text == passwords.g2p) {
                await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$push: {sgroup: ctx.from.id}})
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {gr: 2, hws: passwords.sgroop_hw}})
                await ctx.reply('Success! You have successfully joined the group number 2 ✅', {reply_markup: {remove_keyboard: true}})
                await ctx.scene.leave('gsgp')
            }else {
                await ctx.reply('Incorrect password ⚠️')
                await ctx.scene.enter('gsgp')
            }
        }
    } catch (e) {
        console.error(e);
    }
})


const stage = new Scenes.Stage([nameget, news, groupanalyse, gfgp, gsgp]);  
bot.use(session());
bot.use(stage.middleware());  

bot.start(async (ctx) => {
    try {
        let usindb = await collection.findOne({users: ctx.from.id})
        if (usindb == null) await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$push: {users: ctx.from.id}})
        await ctx.reply(`👨🏻‍💻 Greetings, ${ctx.from.first_name}! I am Mr. ZADE's personal messenger and can forward your text, audio and photo messages. Just send me a message!`)
    } catch (e) {
        console.error(e);
    }
});

bot.help((ctx) => ctx.reply('👨🏻‍💻 Just send me a message to forward it:'));

bot.command('news', async ctx => {
    try {
        if (ctx.from.id == 1334751749 || ctx.from.id == 5103314362) return await ctx.scene.enter('news')
        await ctx.reply('You don\'t have enough rights ⛔️')
    } catch (e) {
        console.error(e);
    }
})

bot.command('z_school', async ctx => {
    try {
        const ingrf = await collection.findOne({fgroup: ctx.from.id})
        const ingrs = await collection.findOne({sgroup: ctx.from.id})

        if(ingrf != null || ingrs != null) return await ctx.reply('👤 You are already connected to one of the groups you selected earlier.')

        await ctx.scene.enter('groupanalyse')
    } catch (e) {
        console.error(e);
    }
})

// 1334751749
bot.on('message', async ctx => {
    try {
        if (ctx.from.id == 1334751749) {
            if(ctx.message.reply_to_message){
                if (ctx.message.voice) {
                    const audiourl = await ctx.tg.getFileLink(ctx.message.voice.file_id)
                    if(ctx.message.reply_to_message.audio) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendAudio(user.user_id, {url: audiourl.href, filename: 'voice'}, {caption: `<b>${user.realname}:\nvoice</b>\n\n<b>ZADE:</b>\nvoice`,disable_notification: false, parse_mode: "HTML", duration: ctx.message.voice.duration})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else if(ctx.message.reply_to_message.photo) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendAudio(user.user_id, {url: audiourl.href, filename: 'voice'}, {caption: `<b>${user.realname}:\nphoto</b>\n\n<b>ZADE:</b>\nvoice`,disable_notification: false, parse_mode: "HTML", duration: ctx.message.voice.duration})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.text}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendAudio(user.user_id, {url: audiourl.href, filename: 'voice'}, {caption: `<b>${ctx.message.reply_to_message.text}</b>\n\n<b>ZADE:</b>\nvoice`,disable_notification: false, parse_mode: "HTML", duration: ctx.message.voice.duration})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }
                    return await ctx.reply('Sended 👨🏻‍💻')
                }else if(ctx.message.photo) {
                    const photourl = await ctx.tg.getFileLink(ctx.message.photo.pop().file_id)
                    if(ctx.message.reply_to_message.audio) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendPhoto(user.user_id, {url: photourl.href}, {caption: `<b>${user.realname}:\nvoice</b>\n\n<b>ZADE:</b>\nphoto`,disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else if(ctx.message.reply_to_message.photo) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendPhoto(user.user_id, {url: photourl.href}, {caption: `<b>${user.realname}:\nphoto</b>\n\n<b>ZADE:</b>\nphoto`,disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.text}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendPhoto(user.user_id, {url: photourl.href}, {caption: `<b>${ctx.message.reply_to_message.text}</b>\n\n<b>ZADE:</b>\nphoto`,disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }
                    return await ctx.reply('Sended 👨🏻‍💻')
                }else if(ctx.message.text) {
                    if(ctx.message.reply_to_message.audio) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendMessage(user.user_id, `<b>${user.realname}:\nvoice</b>\n\n<b>ZADE:</b>\n${ctx.message.text}`, {disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else if(ctx.message.reply_to_message.photo) {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.caption}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendMessage(user.user_id, `<b>${user.realname}:\nphoto</b>\n\n<b>ZADE:</b>\n${ctx.message.text}`, {disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }else {
                        const user = await collection.findOne({conver: {mi: ctx.message.reply_to_message.message_id, id: ctx.message.reply_to_message.text}})
                        if(user == null) return ctx.reply('👨🏻‍💻 Message not found or chat history cleared in database')
                        const zademess = await ctx.tg.sendMessage(user.user_id, `<b>${ctx.message.reply_to_message.text}</b>\n\n<b>ZADE:</b>\n${ctx.message.text}`, {disable_notification: false, parse_mode: "HTML"})
                        await collection.findOneAndUpdate({user_id: user.user_id}, {$push: {conver: zademess.message_id}})
                    }
                    await ctx.reply('Sended 👨🏻‍💻')
                }else {
                    return await ctx.reply('👨🏻‍💻 I only accept text, voice and photo messages.')
                }
            }else {
                return
            }
        } else {
            let user = await collection.findOne({user_id: ctx.from.id});
            if (user == null) return await ctx.scene.enter('nameget');
            let date = await DateTime.now().setZone('Asia/Tashkent').setLocale('uz-UZ');
            if(ctx.message.voice) {
                let userdb = await collection.findOne({user_id: ctx.from.id})
                if(userdb.day != date.c.day) {
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {day: date.c.day}}) 
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$unset: {conver: []}})
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {conver: []}})
                }
                const audiourl = await ctx.tg.getFileLink(ctx.message.voice.file_id)
                const sendedmessage = await ctx.tg.sendAudio(1334751749, {url: audiourl.href, filename: 'voice'}, {caption: `<b>From</b>: ${userdb.realname}`, parse_mode: "HTML", duration: ctx.message.voice.duration})
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$push: {conver: {mi: sendedmessage.message_id, id: `From: ${userdb.realname}`}}});
                return ctx.reply('👨🏻‍💻 Forwarded')
            }else if(ctx.message.photo){
                let userdb = await collection.findOne({user_id: ctx.from.id})
                if(userdb.day != date.c.day) {
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {day: date.c.day}}) 
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$unset: {conver: []}})
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {conver: []}})
                }
                const photourl = await ctx.tg.getFileLink(ctx.message.photo.pop().file_id)
                const sendedmessage = await ctx.tg.sendPhoto(1334751749, {url: photourl.href, filename: 'photo'}, {caption: `<b>From</b>: ${userdb.realname}`, parse_mode: "HTML"})
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$push: {conver: {mi: sendedmessage.message_id, id: `From: ${userdb.realname}`}}});
                return ctx.reply('👨🏻‍💻 Forwarded')
            }else if(ctx.message.text){
                let userdb = await collection.findOne({user_id: ctx.from.id})
                if(userdb.day != date.c.day) {
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {day: date.c.day}}) 
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$unset: {conver: []}})
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {conver: []}})
                }
                // const uzbekistanDate = day.toLocaleString('ru-RU', {timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', hour: 'numeric', minute: 'numeric'});
                const text = ctx.message.text;
                const sendedmessage = await ctx.tg.sendMessage(1334751749, `<b>${userdb.realname}</b>:\n${text}`, {parse_mode: 'HTML'})
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$push: {conver: {mi: sendedmessage.message_id, id: `${userdb.realname}:\n${text}`}}});
                return ctx.reply('👨🏻‍💻 Forwarded')
            }else {
                return ctx.reply('👨🏻‍💻 I only accept text, voice and photo messages.')
            }
        }

    } catch (e) {
        console.error(e);
    }
})


bot.launch({dropPendingUpdates: true});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));