const Discord = require("discord.js")
const Canvas = require('canvas')

const shikePunch = async (message) => {
    let targetMember = message.mentions.members.first();
    const canvas = Canvas.createCanvas(1336, 1087);
    const context = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./img/shike_punch.png');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
    context.drawImage(avatar, 605, 325, 300, 300);
    if (targetMember) {
        const punched_avatar = await Canvas.loadImage(targetMember.user.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(punched_avatar, 105, 325, 300, 300);
    }
    // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'punch.png');
    { targetMember 
        ? message.channel.send(`${message.author} ha pegado a <@${targetMember.user.id}>!`, attachment)
        : message.channel.send(`${message.author} ha pegado a Shike!`, attachment)
    }}
module.exports = {shikePunch}