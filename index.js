const { Scenes, session, Telegraf, Markup } = require('telegraf');
const { collection, ObjectId } = require('./additions/db');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const { DateTime } = require('luxon');
bot.start((ctx) => ctx.reply(`👨🏻‍💻 Greetings, ${ctx.from.first_name}! I am Mr. ZADE's personal messenger and can forward your text, audio and photo messages. Just send me a message!`));
bot.help((ctx) => ctx.reply('👨🏻‍💻 Send me a message:'));
bot.launch({dropPendingUpdates: true});
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

const stage = new Scenes.Stage([nameget]);  
bot.use(session());
bot.use(stage.middleware());  


// 1334751749, 
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









// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));