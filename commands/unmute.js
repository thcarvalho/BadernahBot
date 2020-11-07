module.exports = {
  async unmute(message, emitter) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    const muterole = message.guild.roles.cache.get('@muterole');
    const mainrole = message.guild.roles.cache.get('@mainrole');

    try {
      if (!member.roles.cache.get(muterole.id)) {
        return message.channel.send('Membro não está mutado!')
      }

      emitter.emit('clearTimeout', (member.id + message.guild.id))

      member.roles.remove(muterole.id)
      member.roles.add(mainrole.id)

      // message.guild.roles.cache.get(muterole.id).delete()

      return message.channel.send(`${member} desmutado`)
    } catch (error) {
      console.log(error);
    }

  }
}