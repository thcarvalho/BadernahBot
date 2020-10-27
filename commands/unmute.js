

module.exports = {
  async unmute(message, emitter) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    const muterole = message.guild.roles.cache.get('@muterole');

    if (muterole) {
      try {
        emitter.emit('clearTimeout', member.id)
        member.roles.remove(muterole.id)
        message.guild.roles.cache.get(muterole.id).delete()
        message.channel.send(`${member} desmutado`)
      } catch (error) {
        console.log(error);
      }
    }
  }
}