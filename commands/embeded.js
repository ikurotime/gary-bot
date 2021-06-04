const Discord = require("discord.js")

const exampleEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Comandos disponibles para el bot')
.setDescription('*Esto es lo que puedo hacer*')
.setThumbnail('https://i.imgur.com/PuvozXs.png?1')
.addFields(
    { name: '--- FUN ---', value:'*Comandos variados*'},
    { name: '`g say [contenido]`', value: 'Digo lo que quieras' },
    { name: '`g punch`', value: '¡Pégale al Shike en la cara!'},
    { name: '`g punch @user`', value: 'Pégale al alguien más en la cara'},
    { name: '`g ching`', value: 'Chong!'},
    { name: '`g 8ball [contenido]`', value: 'Respondo a tu pregunta, mi veredicto es absoluto'},
    { name: '--- MÚSICA ---', value:'*Comandos de música*'},
    { name: '`g join`', value: 'Me uno a tu canal de voz'},
    { name: '`g leave`', value: 'Me voy del canal de voz'},
    { name: '`g play [contenido]`', value: 'Busco una canción por su nombre y la pongo en voz (1er resultado)'},
    { name: '`g pause`', value: 'Pausa la canción actual'},
    { name: '`g resume`', value: 'Reaunuda la canción actual'},
    { name: '`g skip`', value: 'Salta la canción actual'},
    { name: '`g queue`', value: 'Muestro la lista de reproducción y te doy info de la canción'}
)
.setTimestamp()
.setFooter('Gary \'s vessel', 'https://i.imgur.com/PuvozXs.png?1');



module.exports = {exampleEmbed}