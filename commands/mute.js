const ms = require('ms')
let timeoutArray = []

module.exports = {
  async mute(message, emitter) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    try {

      const muterole = message.guild.roles.cache.get('@muterole');
      const mainrole = message.guild.roles.cache.get('@mainrole');

      if (!mainrole) {
        return message.channel.send('Você precisa setar um cargo padrão primeiro!')
      }

      if (member.roles.cache.get(muterole.id)) {
        return message.channel.send('Membro já está mutado!')
      }

      member.roles.remove(mainrole.id)
      member.roles.add(muterole.id)
      message.channel.send(`${member} mutado`)

      const muteTimeout = setTimeout(() => {
        try {
          if (muterole) {

            member.roles.remove(muterole.id)
            member.roles.add(mainrole.id)

            // message.guild.roles.cache.get(muterole.id).delete()
            message.channel.send(`${member} desmutado`)
            timeoutArray.splice((member.id + message.guild.id), 1)
          }
        } catch (error) {
          console.log(error);
        }
      }, 20000)

      timeoutArray[(member.id + message.guild.id)] = muteTimeout


      emitter.on('clearTimeout', (id) => {
        const timeout = timeoutArray[id]
        clearTimeout(timeout)
        timeoutArray.map(arr => {
          if (arr[id] === timeout) {
            arr.splice(id, 1)
          }
        })
      })

      // console.log(timeoutArray);

    } catch (error) {
      console.log(error);
    }
  }
}