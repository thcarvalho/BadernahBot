module.exports = {
  async cargo(message) {
    
    try {
      const mainrole = await message.mentions.roles.first();

      if (!mainrole) {
        return message.channel.send('Digite qual o cargo padrão do servidor')
      }

      const muterole = await message.guild.roles.create({
        data: {
          name: "BADERNEIRO",
          color: "DARK_RED",
          permissions: []
        }
      })

      await message.channel.updateOverwrite(muterole, { SEND_MESSAGES: false })

      message.guild.channels.cache.forEach(async channel => {
        await channel.updateOverwrite(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
        })
      })

      message.guild.roles.cache.set('@muterole', muterole)
      message.guild.roles.cache.set('@mainrole', mainrole)

      return message.channel.send('Cargo atualizado') 
    } catch (error) {
      console.log(error);
    }
  }
}