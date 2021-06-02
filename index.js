const Discord = require("discord.js")
const config = require("./config.json")
const Canvas = require('canvas');

const client = new Discord.Client()
const prefix = "-g ";

const exampleEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Gary te ayuda           ')
.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
.setDescription('*Esto es lo que puedo hacer*')
.setThumbnail('https://i.imgur.com/wSTFkRM.png')
.addFields(
    { name: '`-g say [contenido]`', value: 'Digo lo que quieras' },
    { name: '`-g punch`', value: 'Pegale al Shike en la cara'},
    { name: '`-g ching`', value: 'Chong!'},
)
.setTimestamp()
.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');


client.on("message", message =>{
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  let texto = args.join(" ");
    switch (command) {
        case 'help':
            message.channel.send(exampleEmbed);
            break;
        case 'ching':
            message.channel.send(`Chong!`);
            break;
        case 'say':
            if(!texto) return message.reply(`Escribe algo para decir.\n \`!g say [contenido]\``);
            message.delete({options:100});
            message.channel.send(texto);
            break;
        case 'punch':
        message.channel.send('Espera que tomo la foto...')

        const shikePunch = async () => {
            const canvas = Canvas.createCanvas(1336, 1087);
            const context = canvas.getContext('2d');
            // Since the image takes time to load, you should await it
            const background = await Canvas.loadImage('./img/shike_punch.png');
            // This uses the canvas dimensions to stretch the image onto the entire canvas
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
            context.drawImage(avatar, 605, 325, 300, 300);

            // Use the helpful Attachment class structure to process the file for you
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        
            message.channel.send(`${message.author} ha pegado a Shike!`, attachment);
            }

        shikePunch()
            break;
        default:
            message.channel.send('a')
            break;
    }

});

client.login(config.BOT_TOKEN)