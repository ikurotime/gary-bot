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
    volume: 5, // volumen al iniciar la cola
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
   const playSong = async (message,args, serverQueue, queue, play, disbut) => {
    
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
            key: process.env.YT_KEY, //Necesitas una CLAVE de la API de youtube. 
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
           let Option1 = new disbut.MessageButton()
          .setStyle('gray')
          .setID('one') 
          .setLabel(`1. ${songArg.results[0].title.substring(0,75)}`)
          let Option2 = new disbut.MessageButton()
          .setStyle('gray')
          .setID('two') 
          .setLabel(`2. ${songArg.results[1].title.substring(0,75)}`)
          let Option3 = new disbut.MessageButton()
          .setStyle('gray')
          .setID('three') 
          .setLabel(`3. ${songArg.results[2].title.substring(0,75)}`)
          let Option4 = new disbut.MessageButton()
          .setStyle('gray')
          .setID('four') 
          .setLabel(`4. ${songArg.results[3].title.substring(0,75)}`)
          let Option5 = new disbut.MessageButton()
          .setStyle('gray')
          .setID('five') 
          .setLabel(`5. ${songArg.results[4].title.substring(0,75)}`)

          let buttonRow1 = new disbut.MessageActionRow()
          .addComponent(Option1)
          let buttonRow2 = new disbut.MessageActionRow()
          .addComponent(Option2)
          let buttonRow3 = new disbut.MessageActionRow()
          .addComponent(Option3)
          let buttonRow4 = new disbut.MessageActionRow()
          .addComponent(Option4)
          let buttonRow5 = new disbut.MessageActionRow()
          .addComponent(Option5)
          const embed = new Discord.MessageEmbed()
          .setTitle('Escoge la canción 👇')
          .setColor(config.COLOR_EMBED);

          let m = await message.channel.send({components: [buttonRow1,buttonRow2,buttonRow3,buttonRow4,buttonRow5], embed:embed})
          
            const filter = (button) => button.clicker.user.id === message.author.id;
            const collector = m.createButtonCollector(filter, { time: 20000 });
            collector.on('collect', async b => {
              console.log(b.id)
              b.defer()
              if (b.id === 'one') {
                songURL = songArg.results[0].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                b.message.delete()
                collector.stop()
              } else if (b.id === 'two') {
                songURL = songArg.results[1].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                b.message.delete()
              } else if (b.id === 'three') {
                songURL = songArg.results[2].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                b.message.delete()
              }else if (b.id === 'four') {
                songURL = songArg.results[3].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                b.message.delete()
              }else if (b.id === 'five') {
                songURL = songArg.results[4].link;
                playSelectedSong(message,songURL, serverQueue, queue, play,voiceChannel)
                b.message.delete()
              }
            })
            
        

        }
        
        
   }
   module.exports = { playSong }