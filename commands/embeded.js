const Discord = require("discord.js")

const exampleEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Comandos disponibles para el bot - 1')
.setDescription('*Esto es lo que puedo hacer*')
.setThumbnail('https://i.imgur.com/PuvozXs.png?1')
.addFields(
    { name: '--- FUN ---', value:'*Comandos variados*'},
    { name: '`g say [contenido]`', value: 'Digo lo que quieras' },
    { name: '`g punch`', value: '¡Pégale al Shike en la cara!'},
    { name: '`g punch @user`', value: 'Pégale al alguien más en la cara'},
    { name: '`g ching`', value: 'Chong!'},
    { name: '`g 8ball [contenido]`', value: 'Respondo a tu pregunta, mi veredicto es absoluto'},
    { name: '`g meme`', value: 'Te saco un meme de r/memes'},
    { name: '`g cursed`', value: 'Te saco un meme de r/cursedcomments'},
    { name: '`g kurama`', value: 'Te saco un mate kurama'},
)
.setTimestamp()
.setFooter('Gary \'s vessel', 'https://i.imgur.com/PuvozXs.png?1');

const exampleEmbed2 = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Comandos disponibles para el bot - 2')
.setDescription('*Gary por el día, DJ Vessel por la noche*')
.setThumbnail('https://i.imgur.com/PuvozXs.png?1')
.addFields(
    { name: '--- MÚSICA ---', value:'*Comandos de música*'},
    { name: '`g join`', value: 'Me uno a tu canal de voz'},
    { name: '`g leave`', value: 'Me voy del canal de voz'},
    { name: '`g play [contenido] / [link]`', value: 'Busco una canción por su nombre y la pongo en voz'},
    { name: '`g pause`', value: 'Pausa la canción actual'},
    { name: '`g resume`', value: 'Reaunuda la canción actual'},
    { name: '`g skip`', value: 'Salta la canción actual'},
    { name: '`g queue`', value: 'Muestro la lista de reproducción y te doy info de la canción'}
)
.setTimestamp()
.setFooter('Gary \'s vessel', 'https://i.imgur.com/PuvozXs.png?1');


module.exports = {exampleEmbed, exampleEmbed2}