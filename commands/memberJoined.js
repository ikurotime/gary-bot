const Discord = require("discord.js")
const Canvas = require('canvas')

const memberJoined = async (member, channel) =>{
    const canvas = Canvas.createCanvas(595, 447);
    const context = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./img/everyfuckintime.png');
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    context.drawImage(avatar, 295, 20,90, 90);
   
    // Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome.png');
    channel.send(`*${member} ha entrado epicamente al chat*`, attachment)
}
module.exports = { memberJoined }