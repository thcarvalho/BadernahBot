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
            timeoutArray.splice((member.id + message.guild.id), 1)
          }
        } catch (error) {
          console.log(error);
        }
      }, ms('1d'))

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

      console.log(timeoutArray);

    } catch (error) {
      console.log(error);
    }
  }
}