const ms = require('ms')
let timeoutArray = []

module.exports = {
  async mute(message, emitter) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    let muterole

    try {
      muterole = await message.guild.roles.create({
        data: {
          name: "Mutado",
          color: "DARK_RED",
          permissions: []
        }
      })

      message.channel.updateOverwrite(muterole, { SEND_MESSAGES: false })

      message.guild.channels.cache.forEach(async channel => {
        await channel.updateOverwrite(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
        })
      })

      member.roles.add(muterole.id)
      
      message.channel.send(`${member} mutado`)
      message.guild.roles.cache.set('@muterole', muterole)

      const muteTimeout = setTimeout(() => {
        try {
          if (muterole) {
            member.roles.remove(muterole.id)
            message.guild.roles.cache.get(muterole.id).delete()
            message.channel.send(`${member} desmutado`)
          }
        } catch (error) {
          console.log(error);
        }
      }, ms('1d'))

      timeoutArray[member.id] = muteTimeout

      emitter.on('clearTimeout', (id) => {
        const timeout = timeoutArray[id]
        clearTimeout(timeout)
      })



    } catch (error) {
      console.log(error);
    }
  }
}