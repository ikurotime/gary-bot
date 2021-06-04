const joinChannel = (message) =>{
    let canalvoz = message.member.voice.channel;
    if(!canalvoz || canalvoz.type !== 'voice') {
        message.channel.send('¡Necesitas unirte a un canal de voz primero!.');
    
    } else if (message.guild.voiceConnection) {
        message.channel.send('Ya estoy conectado en un canal de voz.');
    
    } else {
        message.channel.send('Conectando...').then(m => {
            canalvoz.join().then(() => {
                m.edit('Conectado exitosamente.').catch(error => console.log(error));
    
            }).catch(error => console.log(error));
    
        }).catch(error => console.log(error));
}
}
const leaveChannel = (message) =>{
    let Canalvoz = message.member.voice.channel;

        if(!Canalvoz) {
            message.channel.send('No estas conectado a un canal de voz.');

        } else {
            message.channel.send('Dejando el canal de voz.').then(() => {
                Canalvoz.leave();
            }).catch(error => console.log(error));
        } 
}
module.exports = { joinChannel, leaveChannel }