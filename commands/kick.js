module.exports = {
  async kick(message) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    await member.kick()

    return message.reply(`Membro ${user.tag} kickado`)
  }
}