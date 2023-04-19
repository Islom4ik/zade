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
        await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADH2RABkQt6cCAviwTkzy9_zFM2xo8AALSyTEbHEHxSWulnc6dYshXAQADAgADeQADLwQ', {caption: 'Ok... Send me any message:', reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
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
        await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHWRABiPCxUBmOx5Lgb9txPwMvKyrAALWyTEbHEHxSfu1QJ-QIw5fAQADAgADeAADLwQ', {caption: 'Choose your group:', reply_markup: {inline_keyboard: [[Markup.button.callback('Groots 🌴', 'g1'), Markup.button.callback('Groots 🌴🌴', 'g2')], [Markup.button.callback('Cancel ⛔️', 'cancgr')]]}})
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

groupanalyse.on('message', async ctx => {
    try {
        return ctx.reply('Click on one of the buttons ⬆️')
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

let points = 0
const gfedp = new Scenes.BaseScene("gfedp");

gfedp.enter(async ctx => {
    try {
        await ctx.reply('👨🏻‍💻 Enter how many points you want to add for the first group:', {reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})


gfedp.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {remove_keyboard: true}})
            await ctx.scene.leave('gfedp')
        } else {
            let check = await isNaN(ctx.message.text)
            if (check == true) return await ctx.scene.enter('gfedp')
            await ctx.reply('Working on it...', {reply_markup: {remove_keyboard: true}})
            points = Number(ctx.message.text)
            await ctx.reply('Are you shure?', {reply_markup: {inline_keyboard: [[Markup.button.callback('Yes, 100%', 'yedf'), Markup.button.callback('Edit', 'ednf')]]}})
        }
    } catch (e) {
        console.error(e);
    }
})

gfedp.action('yedf', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        const res = await db.fgs + points
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$set: {fgs: res}})
        await ctx.reply('Change completed 👨🏻‍💻')
        await ctx.scene.leave('gfedp')
    } catch (e) {
        console.error(e);
    }
})

gfedp.action('ednf', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gfedp')
    } catch (e) {
        console.error(e);
    }
})

const gsedp = new Scenes.BaseScene("gsedp");

gsedp.enter(async ctx => {
    try {
        await ctx.reply('👨🏻‍💻 Enter how many points you want to add for the second group:', {reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})


gsedp.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {remove_keyboard: true}})
            await ctx.scene.leave('gsedp')
        } else {
            let check = await isNaN(ctx.message.text)
            if (check == true) return await ctx.scene.enter('gsedp')
            await ctx.reply('Working on it...', {reply_markup: {remove_keyboard: true}})
            points = Number(ctx.message.text)
            await ctx.reply('Are you shure?', {reply_markup: {inline_keyboard: [[Markup.button.callback('Yes, 100%', 'yeds'), Markup.button.callback('Edit', 'edns')]]}})
        }
    } catch (e) {
        console.error(e);
    }
})

gsedp.action('yeds', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        const res = await db.sgs + points
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$set: {sgs: res}})
        await ctx.reply('Change completed 👨🏻‍💻')
        await ctx.scene.leave('gsedp')
    } catch (e) {
        console.error(e);
    }
})

gsedp.action('edns', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gsedp')
    } catch (e) {
        console.error(e);
    }
})

const bookord = new Scenes.BaseScene("bookord");

bookord.enter(async ctx => {
    try {
        const db = await collection.findOne({user_id: ctx.from.id})
        if (db.bmesid != 0) {
            try {
                await ctx.deleteMessage(db.bmesid)
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
            } catch (e) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
            }
        }
        if (db.cmesid != 0) {
            try {
                await ctx.deleteMessage(db.cmesid)
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
            } catch (e) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
            }
        }
        const cardph = await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHGRABg0v3F36r7EgInSWO169e7CrAALXyTEbHEHxSdVGe1c-Rhd2AQADAgADeQADLwQ', {parse_mode: 'MarkdownV2', caption: '`8600490456114966`', reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
        const awaiting = await ctx.reply('👨🏻‍💻 Pay 100,000 sum to the card above and send screenshot of payment receipt:')
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {b_trash: [cardph.message_id, awaiting.message_id]}})
    } catch (e) {
        console.error(e);
    }
})

bookord.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']],resize_keyboard: true}})
            return ctx.scene.leave('bookord')
        }
        await ctx.reply('👨🏻‍💻 Please send a screenshot of the payment:')
    } catch (e) {
        console.error(e);
    }
})

bookord.on('photo', async ctx => {
    try {
        await ctx.reply('Working on it...', {reply_markup: {remove_keyboard: true}})
        const db = await collection.findOne({user_id: ctx.from.id})
        for (let i = 0; i < db.b_trash.length; i++) {
            try {
                await ctx.deleteMessage(db.b_trash[i])
            } catch (e) {
                console.error(e);
            }
        }
        const addb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        let rs = addb.payids + 1
        await ctx.tg.sendPhoto(1334751749, ctx.message.photo.pop().file_id, {caption: `#${rs} New payment for a book | GENETICS 🧬:\n\n<b>Real Name:</b> <a href="tg://user?id=${db.user_id}">${db.realname}</a>\n<b>User Name:</b> <i>@${db.username}</i>\n<b>TG Account Name:</b> <i>${db.accfirstname}</i>\n<b>User ID:</b> <i>${db.user_id}</i>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('DONE ✅', 'b_payd')], [Markup.button.callback('REJECT ❌', 'b_payr')]]}})
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$set: {payids: rs}})
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {upid: rs}})
        await ctx.reply('💸 Payment sent for review, please wait for a response...', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']],resize_keyboard: true}})
        await ctx.scene.leave('bookord')
    } catch (e) {
        console.error(e);
    }
})

const coursepay = new Scenes.BaseScene("coursepay");

coursepay.enter(async ctx => {
    try {
        const db = await collection.findOne({user_id: ctx.from.id})
        if (db.bmesid != 0) {
            try {
                await ctx.deleteMessage(db.bmesid)
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
            } catch (e) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
            }
        }
        if (db.cmesid != 0) {
            try {
                await ctx.deleteMessage(db.cmesid)
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
            } catch (e) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
            }
        }
        const cardph = await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHGRABg0v3F36r7EgInSWO169e7CrAALXyTEbHEHxSdVGe1c-Rhd2AQADAgADeQADLwQ', {parse_mode: 'MarkdownV2', caption: '`8600490456114966`', reply_markup: {keyboard: [['Cancel 🔴']], resize_keyboard: true}})
        const awaiting = await ctx.reply('👨🏻‍💻 Pay to the card above and send screenshot of payment receipt:')
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {b_trash: [cardph.message_id, awaiting.message_id]}})
    } catch (e) {
        console.error(e);
    }
})

coursepay.on('text', async ctx => {
    try {
        if(ctx.message.text == 'Cancel 🔴') {
            await ctx.reply('Canceled ✅', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']],resize_keyboard: true}})
            return ctx.scene.leave('coursepay')
        }
        await ctx.reply('👨🏻‍💻 Please send a screenshot of the payment:')
    } catch (e) {
        console.error(e);
    }
})

coursepay.on('photo', async ctx => {
    try {
        await ctx.reply('Working on it...', {reply_markup: {remove_keyboard: true}})
        const db = await collection.findOne({user_id: ctx.from.id})
        for (let i = 0; i < db.b_trash.length; i++) {
            try {
                await ctx.deleteMessage(db.b_trash[i])
            } catch (e) {
                console.error(e);
            }
        }
        const addb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        let rs = addb.cpayids + 1
        await ctx.tg.sendPhoto(1334751749, ctx.message.photo.pop().file_id, {caption: `#${rs} New payment for a course | ZADE'S SCHOOL 📚:\n\n<b>Real Name:</b> <a href="tg://user?id=${db.user_id}">${db.realname}</a>\n<b>User Name:</b> <i>@${db.username}</i>\n<b>TG Account Name:</b> <i>${db.accfirstname}</i>\n<b>User ID:</b> <i>${db.user_id}</i>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('DONE ✅', 'c_payd')], [Markup.button.callback('REJECT ❌', 'c_payr')]]}})
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$set: {cpayids: rs}})
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {upid: rs}})
        await ctx.reply('💸 Payment sent for review, please wait for a response...', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']],resize_keyboard: true}})
        await ctx.scene.leave('coursepay')
    } catch (e) {
        console.error(e);
    }
})

const namefpay = new Scenes.BaseScene("namefpay");

namefpay.enter(async ctx => {
    try {
        return await ctx.reply('👨🏻‍💻 It is important for us that you write your real name for further identification ‼️\nIntroduce yourself, write your real name:')
    } catch (e) {
        console.error(e);
    }
})

namefpay.on('text', async ctx => {
    try {
        const searchString = /[\!\#\_\№\"\;\$\%\^\:\&\?\*\(\)\{\}\[\]\?\/\,.\\\|\/\+\=\d]+/g;
        if (ctx.message.text.match(searchString)) return await ctx.reply('👨🏻‍💻 Please enter your real name:');
        const load = await ctx.reply('👨🏻‍💻 Noting...')
        const db = await collection.findOne({user_id: ctx.from.id})
        if(db == null) {
            await collection.insertOne({
                realname: ctx.message.text,
                username: ctx.from.username || 'none',
                accfirstname: ctx.from.first_name,
                user_id: ctx.from.id,
                conver: [],
                bmesid: 0,
                cmesid: 0
            })
        }else {
            await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {realname: ctx.message.text, username: ctx.from.username || 'none', user_id: ctx.from.id, bmesid: 0}})
        }
        await ctx.deleteMessage(load.message_id);
        await ctx.reply(`👨🏻‍💻 Success! Hello ${ctx.message.text}`);
        return await ctx.scene.enter('pointofp')
    } catch (e) {
        console.error(e);
    }
})

const pointofp = new Scenes.BaseScene("pointofp");

pointofp.enter(async ctx => {
    try {
        return await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHmRABjbj1XeC7eFpPwHmbzoJVhvQAALVyTEbHEHxSQRUibhWCIp-AQADAgADeQADLwQ', {caption: '👨🏻‍💻 What the point of the payment?', reply_markup: {keyboard: [['PAY FOR THE BOOK 🧬'], ['PAY FOR THE COURSE 📚'], ['Cancel 🔴']], resize_keyboard: true}})
    } catch (e) {
        console.error(e);
    }
})

pointofp.on('text', async ctx => {
    try {
        if(ctx.message.text == 'PAY FOR THE BOOK 🧬') {
            const db = await collection.findOne({user_id: ctx.from.id})
            if (db.bmesid != 0) {
                try {
                    await ctx.reply('You have already clicked on this button 😡', {reply_to_message_id: db.bmesid})
                } catch (e) {
                    if(e.response.error_code == 400 || e.on.payload.message_thread_id == undefined) {
                        await ctx.reply('😡 So why did you have to remove it? Okay, I\'m kind, here\'s a new one for you:')
                        setTimeout(async () => {
                            const bmeid = await ctx.sendPhoto('AgACAgIAAx0Ccqjl3gADI2RADvVJfeGie5FuAAEMTh3o6yJCYQACncgxG7bfAUrlkqVP4PJCYwEAAwIAA3kAAy8E', {caption: 'GENETICS 🧬 - ZADE\'S BOOK\nBook consists of 8 lessons and contains the explanation of concepts and tasks to solve.\n\n<b>The prise of book is 100 000 sums.</b>', parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('ORDER A BOOK 🧬', 'b_order')]], remove_keyboard: true}})
                            return await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: bmeid.message_id}})
                        }, 1500);
                    }
                }
                return
            }
            const bmeid = await ctx.sendPhoto('AgACAgIAAx0Ccqjl3gADI2RADvVJfeGie5FuAAEMTh3o6yJCYQACncgxG7bfAUrlkqVP4PJCYwEAAwIAA3kAAy8E', {caption: 'GENETICS 🧬 - ZADE\'S BOOK\nBook consists of 8 lessons and contains the explanation of concepts and tasks to solve.\n\n<b>The prise of book is 100 000 sums.</b>', parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('ORDER A BOOK 🧬', 'b_order')]], remove_keyboard: true}})
            return await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: bmeid.message_id}})
        }else if(ctx.message.text == 'PAY FOR THE COURSE 📚') {
            const db = await collection.findOne({user_id: ctx.from.id})
            if (db.cmesid != 0) {
                try {
                    await ctx.reply('You have already clicked on this button 😡', {reply_to_message_id: db.cmesid})
                } catch (e) {
                    if(e.response.error_code == 400 || e.on.payload.message_thread_id == undefined) {
                        await ctx.reply('😡 So why did you have to remove it? Okay, I\'m kind, here\'s a new one for you:')
                        setTimeout(async () => {
                            const cmeid = await ctx.sendVideo('CgACAgIAAx0Ccqjl3gADFWRABMbGz2zTjm-0dwGjbE9ln5q_AAJUJwACtt8BSon-oFw6SWNYLwQ', {caption: 'ZADE\'S SCHOOL 📚 BIO|CHEM COURSE\n\nThis course provides an in-depth exploration of the fundamental principles of biology and chemistry. Through a combination of lectures and interactive class discussions, students will gain a comprehensive understanding of the intricate relationships between biological systems and chemical processes.\n\n<b>The payment amount is already told by Mr Zade. If you have doubts regarding the price please first cancel this menu and write here.</b>', parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('PAY FOR THE COURSE  📚', 'c_pay')]], remove_keyboard: true}})
                            return await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: cmeid.message_id}})
                        }, 1500);
                    }
                }
                return
            }
            const cmeid = await ctx.sendVideo('CgACAgIAAx0Ccqjl3gADFWRABMbGz2zTjm-0dwGjbE9ln5q_AAJUJwACtt8BSon-oFw6SWNYLwQ', {caption: 'ZADE\'S SCHOOL 📚 BIO|CHEM COURSE\n\nThis course provides an in-depth exploration of the fundamental principles of biology and chemistry. Through a combination of lectures and interactive class discussions, students will gain a comprehensive understanding of the intricate relationships between biological systems and chemical processes.\n\n<b>The payment amount is already told by Mr Zade. If you have doubts regarding the price please first cancel this menu and write here.</b>', parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('PAY FOR THE COURSE  📚', 'c_pay')]], remove_keyboard: true}})
            return await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: cmeid.message_id}})
        }else if(ctx.message.text == 'Cancel 🔴') {
            const db = await collection.findOne({user_id: ctx.from.id})
            if (db.bmesid != 0) {
                try {
                    await ctx.deleteMessage(db.bmesid)
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
                } catch (e) {
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
                }
            }
            if (db.cmesid != 0) {
                try {
                    await ctx.deleteMessage(db.cmesid)
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
                } catch (e) {
                    await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
                }
            }
            await ctx.reply('Canceled ✅', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']],resize_keyboard: true}})
            return await ctx.scene.leave('pointofp')
        }else {
            await ctx.reply('Click on one of the buttons above the keyboard ⬇️')
        }
    } catch (e) {
        console.error(e);
    }
})

pointofp.action('b_order', async ctx => {
    try {
        const db = await collection.findOne({user_id: ctx.from.id})
        if(db.upid != 'none') return await ctx.answerCbQuery('Your payment is being verified, please wait while Mr. ZADE will check the payment...', {show_alert: true})
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {bmesid: 0}})
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('bookord')
        await ctx.answerCbQuery()
    } catch (e) {
        console.error(e);
    }
})

pointofp.action('c_pay', async ctx => {
    try {
        const db = await collection.findOne({user_id: ctx.from.id})
        if(db.upid != 'none') return await ctx.answerCbQuery('Your payment is being verified, please wait while Mr. ZADE will check the payment...', {show_alert: true})
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {cmesid: 0}})
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('coursepay')
        
    } catch (e) {
        console.error(e);
    }
})

const stage = new Scenes.Stage([nameget, news, groupanalyse, gfgp, gsgp, gfedp, gsedp, bookord, coursepay, namefpay, pointofp]);  
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

bot.command('update', async ctx => {
    try {
        if(ctx.from.id != 5103314362) return await ctx.reply('🔒')
        const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        for (let i = 0; i < db.fgroup.length; i++) {
            await ctx.tg.sendMessage(db.fgroup[i], 'New update ⬆️\n\n- Improved script reading speed 📶\n- Payment menu for the course and purchase of the book GENETICS 🧬\n- A database for bot files has been created, if you are interested, here is the <a href="https://t.me/+Zle_ffKNuro2NDhi">channel</a> 🛢', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']], resize_keyboard: true}, parse_mode: 'HTML', disable_web_page_preview: true})
        }
        for (let i = 0; i < db.sgroup.length; i++) {
            await ctx.tg.sendMessage(db.sgroup[i], 'New update ⬆️\n\n- Improved script reading speed 📶\n- Payment menu for the course and purchase of the book GENETICS 🧬\n- A database for bot files has been created, if you are interested, here is the <a href="https://t.me/+Zle_ffKNuro2NDhi">channel</a> 🛢', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']], resize_keyboard: true}, parse_mode: 'HTML', disable_web_page_preview: true})
        }
        await ctx.tg.sendMessage(1334751749, 'New update ⬆️\n\n- Improved script reading speed 📶\n- Payment menu for the course and purchase of the book GENETICS 🧬\n- A database for bot files has been created, if you are interested, here is the <a href="https://t.me/+Zle_ffKNuro2NDhi">channel</a> 🛢', {reply_markup: {keyboard: [['STATS 📊'], ['PAYMENTS 💳']], resize_keyboard: true}, parse_mode: 'HTML', disable_web_page_preview: true})
    } catch (e) {
        console.error(e);
    }
})

// bot.command('z_chats', async ctx => {
//     try {
//         let user = await collection.findOne({user_id: ctx.from.id});
//         if (user == null) return await ctx.scene.enter('nameget');
//         if(user.joined == true) return await ctx.reply('You have already joined the group')
//         const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
//         const deljreq = await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGGRABXYFvAUF7w9Cq_NQiAS8OVJKAALbyTEbHEHxSdM9sx4JSH8TAQADAgADeQADLwQ', {caption: '👨🏻‍💻 Chats are designed to call any student of ZADE\'s school who wants to help with a problem at any time and discuss any other topic.\n\nSelect the chat you want to join:', reply_markup: {inline_keyboard: [[Markup.button.callback(`Chat 1 X 1 [${db.otochat.length}/2]`, 'joto')]]}})
//         await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {deljreq: deljreq.message_id}})
//     } catch (e) {
//         console.error(e);
//     }
// })


// BAACAgIAAxkBAAIVfGQ8QWBGBBPsH7JErDbVpmXCOi4EAALJKQACNzmZSYfJo8Cz8xTULwQ
// AgADySkAAjc5mUk
bot.command('pay', async ctx => {
    try {
        const ingrf = await collection.findOne({fgroup: ctx.from.id})
        const ingrs = await collection.findOne({sgroup: ctx.from.id})

        if(ingrf != null || ingrs != null || ctx.from.id == 1334751749) {
            const db = await collection.findOne({user_id: ctx.from.id})
            if(db == null) {
                await collection.insertOne({
                    username: ctx.from.username || 'none',
                    accfirstname: ctx.from.first_name,
                    user_id: ctx.from.id,
                    conver: [],
                    upid: 'none'
                })
            }else if(!db.upid) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {upid: 'none'}})
            }
            await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHmRABjbj1XeC7eFpPwHmbzoJVhvQAALVyTEbHEHxSQRUibhWCIp-AQADAgADeQADLwQ', {reply_markup: {inline_keyboard: [[Markup.button.callback('GET STARTED 💳', 'proce')]]}})
        }else {
            await ctx.reply('This command can only be used by ZADE school students ⚠️\nTo begin with, you must pass student verification in order to use this command. For verification - /z_school')
        }
    } catch (e) {
        console.error(e);
    }
})

bot.hears(['PAYMENTS 💳'], async ctx => {
    try {
        const ingrf = await collection.findOne({fgroup: ctx.from.id})
        const ingrs = await collection.findOne({sgroup: ctx.from.id})

        if(ingrf != null || ingrs != null || ctx.from.id == 1334751749) {
            const db = await collection.findOne({user_id: ctx.from.id})
            if(db == null) {
                await collection.insertOne({
                    username: ctx.from.username || 'none',
                    accfirstname: ctx.from.first_name,
                    user_id: ctx.from.id,
                    conver: [],
                    upid: 'none'
                })
            }else if(!db.upid) {
                await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {upid: 'none'}})
            }
            await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADHmRABjbj1XeC7eFpPwHmbzoJVhvQAALVyTEbHEHxSQRUibhWCIp-AQADAgADeQADLwQ', {reply_markup: {inline_keyboard: [[Markup.button.callback('GET STARTED 💳', 'proce')]]}})
        }else {
            await ctx.reply('This command can only be used by ZADE school students ⚠️\nTo begin with, you must pass student verification in order to use this command. For verification - /z_school')
        }
    } catch (e) {
        console.error(e);
    }
})

bot.action('proce', async ctx => {
    try {
        await ctx.reply('Launching...', {reply_markup: {remove_keyboard: true}})
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('namefpay')
        await ctx.answerCbQuery('Let\'s start...', {show_alert: false})
    } catch (e) {
        console.error(e);
    }
})

bot.action('joto', async ctx => {
    try {
        let user = await collection.findOne({user_id: ctx.from.id});
        if(user.joined == true) return await ctx.reply('You have already joined the group')
        if(user.linkgenrtd == true) {
            await ctx.answerCbQuery()
            return await ctx.reply('Click the button above ⬆️')
        }
        const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        if(db.otochat.length >= 2) return await ctx.answerCbQuery('Sorry the room is busy 🟠')
        const link = await ctx.tg.exportChatInviteLink(-1001945378010)
        const jlink = await ctx.reply('Click the button below to join:', {reply_markup: {inline_keyboard: [[Markup.button.url('JOIN', link)]]}})
        await collection.findOneAndUpdate({user_id: ctx.from.id}, {$set: {jlink: jlink.message_id, linkgenrtd: true}})
        await ctx.answerCbQuery()
    } catch (e) {
        console.error(e);
    }
})

bot.action('b_payd', async ctx => {
    try {
        const text = await Number(ctx.callbackQuery.message.caption.split(' ')[0].replace("#", "")) 
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({upid: text})
        await ctx.tg.sendPhoto(db.user_id, 'AgACAgIAAx0Ccqjl3gADF2RABUbBkRL1MVGdEAUnPkhQkhYvAALlxzEbHEH5SeRB81gysZu_AQADAgADeQADLwQ',{caption: `💸 Successful payment for the BOOK | GENETICS 🧬! The payment was successfully verified and if you have any questions, you can write here to contact Mr. Zade`})
        await collection.findOneAndUpdate({upid: text}, {$set: {upid: 'none'}})
        await ctx.reply('Sended ✅')
        await ctx.answerCbQuery('Sended ✅')
    } catch (e) {
        console.error(e);
    }
})

bot.action('b_payr', async ctx => {
    try {
        const text = await Number(ctx.callbackQuery.message.caption.split(' ')[0].replace("#", "")) 
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({upid: text})
        await ctx.tg.sendPhoto(db.user_id, 'AgACAgIAAx0Ccqjl3gADFmRABRzfB9adTdZNPRkNXJYdHWrbAALmxzEbHEH5SfYP_i8c5k4fAQADAgADeQADLwQ',{caption: `💸 Payment Failed (BOOK | GENETICS 🧬)! Payment Failed and if you have any questions, you can write here to contact Mr. Zade`})
        await collection.findOneAndUpdate({upid: text}, {$set: {upid: 'none'}})
        await ctx.reply('Sended ✅')
        await ctx.answerCbQuery('Sended ✅')
    } catch (e) {
        console.error(e);
    }
})

bot.action('c_payd', async ctx => {
    try {
        const text = await Number(ctx.callbackQuery.message.caption.split(' ')[0].replace("#", "")) 
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({upid: text})
        await ctx.tg.sendPhoto(db.user_id, 'AgACAgIAAx0Ccqjl3gADF2RABUbBkRL1MVGdEAUnPkhQkhYvAALlxzEbHEH5SeRB81gysZu_AQADAgADeQADLwQ',{caption: `💸 Successful payment for the COURSE | ZADE'S SCHOOL 📚! The payment was successfully verified and if you have any questions, you can write here to contact Mr. Zade`})
        await collection.findOneAndUpdate({upid: text}, {$set: {upid: 'none'}})
        await ctx.reply('Sended ✅')
        await ctx.answerCbQuery('Sended ✅')
    } catch (e) {
        console.error(e);
    }
})

bot.action('c_payr', async ctx => {
    try {
        const text = await Number(ctx.callbackQuery.message.caption.split(' ')[0].replace("#", "")) 
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        const db = await collection.findOne({upid: text})
        await ctx.tg.sendPhoto(db.user_id, 'AgACAgIAAx0Ccqjl3gADFmRABRzfB9adTdZNPRkNXJYdHWrbAALmxzEbHEH5SfYP_i8c5k4fAQADAgADeQADLwQ',{caption: `💸 Payment Failed (COURSE | ZADE'S SCHOOL 📚)! Payment Failed and if you have any questions, you can write here to contact Mr. Zade`})
        await collection.findOneAndUpdate({upid: text}, {$set: {upid: 'none'}})
        await ctx.reply('Sended ✅')
        await ctx.answerCbQuery('Sended ✅')
    } catch (e) {
        console.error(e);
    }
})

bot.command('stats', async ctx => {
    try {
        const ingrf = await collection.findOne({fgroup: ctx.from.id})
        const ingrs = await collection.findOne({sgroup: ctx.from.id})

        if(ingrf != null || ingrs != null) {
            const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
            if(db.fgs == db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGmRABbn2qCMGzsSvCoPPcyU1zlXYAALZyTEbHEHxSbUcVchU_Nn0AQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> On the same level\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points`, parse_mode: 'HTML'})
            }else if(db.fgs > db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGWRABaahBao18gABSKpV7B6Ck2QmcwAC2skxGxxB8Unn31E8zMDvbQEAAwIAA3gAAy8E', {caption: `🏆 <b>Leading:</b> GOOTS 🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.fgs - db.sgs} point(s) difference</b>`, parse_mode: 'HTML'})
            }else {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADG2RABcqkahsvcWHoanB5Bsq3Z5E8AALYyTEbHEHxSRwe7c5RerKEAQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> GOOTS 🌴🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.sgs - db.fgs} point(s) difference</b>`, parse_mode: 'HTML'})
            }
        }else if(ctx.from.id == 1334751749) {
            const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
            if(db.fgs == db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGmRABbn2qCMGzsSvCoPPcyU1zlXYAALZyTEbHEHxSbUcVchU_Nn0AQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> On the same level\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }else if(db.fgs > db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGWRABaahBao18gABSKpV7B6Ck2QmcwAC2skxGxxB8Unn31E8zMDvbQEAAwIAA3gAAy8E', {caption: `🏆 <b>Leading:</b> GOOTS 🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.fgs - db.sgs} point(s) difference</b>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }else {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADG2RABcqkahsvcWHoanB5Bsq3Z5E8AALYyTEbHEHxSRwe7c5RerKEAQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> GOOTS 🌴🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.sgs - db.fgs} point(s) difference</b>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }
        }else {
            await ctx.reply('This command can only be used by ZADE school students ⚠️')
        }
    } catch (e) {
        console.error(e);
    }
})

bot.hears(['STATS 📊'], async ctx => {
    try {
        const ingrf = await collection.findOne({fgroup: ctx.from.id})
        const ingrs = await collection.findOne({sgroup: ctx.from.id})

        if(ingrf != null || ingrs != null) {
            const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
            if(db.fgs == db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGmRABbn2qCMGzsSvCoPPcyU1zlXYAALZyTEbHEHxSbUcVchU_Nn0AQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> On the same level\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points`, parse_mode: 'HTML'})
            }else if(db.fgs > db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGWRABaahBao18gABSKpV7B6Ck2QmcwAC2skxGxxB8Unn31E8zMDvbQEAAwIAA3gAAy8E', {caption: `🏆 <b>Leading:</b> GOOTS 🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.fgs - db.sgs} point(s) difference</b>`, parse_mode: 'HTML'})
            }else {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADG2RABcqkahsvcWHoanB5Bsq3Z5E8AALYyTEbHEHxSRwe7c5RerKEAQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> GOOTS 🌴🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.sgs - db.fgs} point(s) difference</b>`, parse_mode: 'HTML'})
            }
        }else if(ctx.from.id == 1334751749) {
            const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
            if(db.fgs == db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGmRABbn2qCMGzsSvCoPPcyU1zlXYAALZyTEbHEHxSbUcVchU_Nn0AQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> On the same level\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }else if(db.fgs > db.sgs) {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADGWRABaahBao18gABSKpV7B6Ck2QmcwAC2skxGxxB8Unn31E8zMDvbQEAAwIAA3gAAy8E', {caption: `🏆 <b>Leading:</b> GOOTS 🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.fgs - db.sgs} point(s) difference</b>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }else {
                await ctx.replyWithPhoto('AgACAgIAAx0Ccqjl3gADG2RABcqkahsvcWHoanB5Bsq3Z5E8AALYyTEbHEHxSRwe7c5RerKEAQADAgADeAADLwQ', {caption: `🏆 <b>Leading:</b> GOOTS 🌴🌴\n\n<b>GROOTSI score:</b> <i>${db.fgs}</i> points\n<b>GROOTSII score:</b> <i>${db.sgs}</i> points\n\n<b>${db.sgs - db.fgs} point(s) difference</b>`, parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit scores 📝', 'esc')]]}})
            }
        }else {
            await ctx.reply('This command can only be used by ZADE school students ⚠️')
        }
    } catch (e) {
        console.error(e);
    }
})

bot.action('esc', async ctx => {
    try {
        const db = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.reply(`🗂 Points Editor:\n\n<b>GROOTS I: <i>${db.fgs}</i> p</b>\n<b>GROOTS II: <i>${db.sgs}</i> p</b>`, {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[Markup.button.callback('Edit G1', 'gfed'), Markup.button.callback('Edit G2', 'gsed')]]}})
        await ctx.answerCbQuery()
    } catch (e) {
        console.error(e);
    }
})

bot.action('gfed', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gfedp')
        await ctx.answerCbQuery()
    } catch (e) {
        console.error(e);
    }
})

bot.action('gsed', async ctx => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        await ctx.scene.enter('gsedp')
        await ctx.answerCbQuery()
    } catch (e) {
        console.error(e);
    }
})

bot.on('new_chat_members', async ctx => {
    try {
        await ctx.deleteMessage(ctx.update.message.message_id)
        const db = await collection.findOne({user_id: ctx.update.message.from.id})
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$push: {otochat: ctx.from.id}})
        await collection.findOneAndUpdate({user_id: ctx.update.message.from.id}, {$set: {joined: true, linkgenrtd: false}})
        await ctx.tg.deleteMessage(ctx.update.message.from.id, db.jlink)
        await ctx.tg.deleteMessage(ctx.update.message.from.id, db.deljreq)
        await ctx.reply(`${db.realname} joined the chat`)
        await ctx.tg.sendMessage(db.user_id, 'You have successfully joined the chat ✅')
        // const adb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        // if (adb.otochat.length == 2) return await collection.findOneAndUpdate({user_id: ctx.update.message.from.id}, {$set: {inchat: Math.floor(Date.now() / 1000)}})
    } catch (e) {
        console.error(e);
    }
})

bot.on('left_chat_member', async ctx => {
    try {
        await ctx.deleteMessage(ctx.update.message.message_id)
        await collection.findOneAndUpdate({user_id: ctx.update.message.from.id}, {$set: {joined: false}})
        await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$pull: {otochat: ctx.update.message.from.id}})
        const db = await collection.findOne({user_id: ctx.update.message.from.id})
        await ctx.reply(`${db.realname} left the chat`)
        const adb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
        if (adb.otochat.length == 1) {
            for (let i = 0; i < adb.otochat.length; i++) {
                try {
                    var seconds = await Math.floor(Date. now() / 1000) + 1;
                    await collection.findOneAndUpdate({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')}, {$pull: {otochat: adb.otochat[i]}, $set: {inchat: 0}})
                    await collection.findOneAndUpdate({user_id: adb.otochat[i]}, {$set: {joined: false}})
                    await ctx.tg.kickChatMember(-1001945378010, adb.otochat[i], seconds)
                    await ctx.tg.sendMessage(adb.otochat[i], 'The conversation ended because one of the participants left the chat 🏁')
                } catch (e) {
                   console.error(e); 
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
})

// bot.on('channel_post', async ctx => {
//     console.log(ctx.channelPost);
// })


// bot.on('forward_date', async ctx => {
//     console.log(ctx.update);
// })

// setTimeout(async () => {
//     const adb = await collection.findOne({_id: new ObjectId('63ee6970d8baf2c27a1dd95a')})
//     if(adb.inchat != 0) {
//         const time = await Math.floor(Date.now() / 1000);
//         const tcalc = time - adb.inchat;
//         if(tcalc >= 1200) {
//             await bot.telegram.sendMessage(-1001945378010, 'Attention! It\'s been 20 minutes since the chat started, if you think your conversation has come to an end, I\'ll give you 2 buttons to choose from to let others join the chat who want to discuss anything:', {reply_markup: {inline_keyboard: [[Markup.button.callback('')]]}})
//         }
//     }
// }, 3000);


// 1334751749
bot.on('message', async ctx => {
    try {
        if(ctx.chat.type == 'supergroup') {
            return
        }

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