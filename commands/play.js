const Discord = require("discord.js")
const ytdl = require('ytdl-core')
const config = require("../config.json")
const search = require('youtube-search')

const playSelectedSong = async (message,songURL, serverQueue, queue, play,voiceChannel) =>{
  const songInfo = await ytdl.getInfo(songURL);
const song = {
    title: songInfo.videoDetails.title,
    duration: songInfo.videoDetails.lengthSeconds,
    url: songInfo.videoDetails.video_url,
    thumbnail: songInfo.videoDetails.thumbnails[1].url,
    author: message.author.tag
};
// <-- Verificamos la lista de canciones de un servidor -->
if (!serverQueue) {
    // Si NO hay una lista de música.
      // <-- Creamos nuestra cola de música a reproducir  -->

// Creamos el conjunto de datos para nuestra cola de música
const queueObject = {
    textChannel: message.channel, //guardamos el canal de texto
    voiceChannel: voiceChannel, // guardamos el canal de voz
    connection: null, // un objeto para la conexión 
    songs: [], // creamos la lista de canciones
    volume: 2, // volumen al iniciar la cola
    playing: true, // un objeto para validar la cola de música en reproducción.
};

// <-- Establecer la cola de música  -->

// Creando el conjunto de datos para nuestra cola de música
queue.set(message.guild.id, queueObject);

// Agregamos las canciones al conjunto de datos
queueObject.songs.push(song);

// <-- Conectar al canal de voz  -->

try {
    // Aquí unimos el bot al canal de voz y guardar nuestra conexión en nuestro objeto.
    var connection = await voiceChannel.join();
    queueObject.connection = connection;

    message.channel.send(`Reproduciendo ahora: **${song.title}**`);

    // Llamar a la función de reproducción para comenzar una canción.
    
   
    play(message.guild, queueObject.songs[0]);

} catch (err) {

    // Imprimir el mensaje de error si el bot no puede unirse al chat de voz
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);

}
  
  }else {
    // Si HAY una lista de música reproduciendo.
  
    serverQueue.songs.push(song);
    return message.channel.send(`**${song.title}** ha sido añadido a la cola!, __por: ${message.author.tag}__`);
  
  }
                
}
   const playSong = async (message,args, serverQueue, queue, play) => {
    
    const voiceChannel = message.member.voice.channel;
    var argIsUrl = false
    //verificamos que el usuario solicitante este conectado en un canal de voz.
      if (!voiceChannel) return message.channel.send('¡Necesitas unirte a un canal de voz para reproducir música!');
  
      const permissions = voiceChannel.permissionsFor(message.client.user);
  
    //verificamos que el bot tenga permisos de conectar y de hablar en el canal de voz.
      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('¡Necesito permisos para unirme y hablar en el canal de voz!');
      }
    
    // <-- Capturamos la información de la música a reproducir -->
  
        var opts = {
            maxResults: 5, //Maximo de resultados a encontrar
            key: 'AIzaSyAi8exEgT11gaLBFMp7d3ERpdav3TPXir0', //Necesitas una CLAVE de la API de youtube. 
            type: "video" // Que tipo de resultado a obtener.
        };
        if (args[0].startsWith('http')) argIsUrl = true
        let songArg
        let songURL
        if (argIsUrl){
           songArg = 'noArgs';
           songURL = args[0];
           playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
        }else{
           songArg = await search(args.join(' '), opts);
           const embed = new Discord.MessageEmbed();
        embed.setTitle('Reacciona para elegir la canción')
        embed.setColor(config.COLOR_EMBED);
        embed.addFields(
          {name:'1.',value: songArg.results[0].title},
          {name:'2.',value: songArg.results[1].title},
          {name:'3.',value: songArg.results[2].title},
          {name:'4.',value: songArg.results[3].title},
          {name:'5.',value: songArg.results[4].title})

        message.channel.send(embed).then(async sentEmbed => {
          await sentEmbed.react('1️⃣')
          await sentEmbed.react('2️⃣')
          await sentEmbed.react('3️⃣')
          await sentEmbed.react('4️⃣')
          await sentEmbed.react('5️⃣')
          
            const validEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
            const filter = (reaction, user) => {
              return validEmojis.includes(reaction.emoji.name) && user.id === message.author.id;
            }
            const collector = sentEmbed.createReactionCollector(filter, { time: 20000, maxEmojis: 1 });
            collector.on('collect', (reaction) => {
              const name = reaction.emoji.name;
              //you only use it in two cases but I assume you will use it for all later on
              
              if (name === '1️⃣') {
                songURL = songArg.results[0].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                sentEmbed.delete()
              } else if (name === '2️⃣') {
                songURL = songArg.results[1].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                sentEmbed.delete()
              } else if (name === '3️⃣') {
                songURL = songArg.results[2].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                sentEmbed.delete()
              }else if (name === '4️⃣') {
                songURL = songArg.results[3].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                sentEmbed.delete()
              }else if (name === '5️⃣') {
                songURL = songArg.results[4].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                sentEmbed.delete()
              }
            })
            
        })

        }
        
        
   }
   module.exports = { playSong }