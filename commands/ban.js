module.exports = {
  async ban(message) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    await member.ban({
      reason: 'Muita viadagi'
    })
    return message.reply(`Membro ${user.tag} banido`)
  }
}