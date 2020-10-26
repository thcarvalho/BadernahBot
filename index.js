const Discord = require('discord.js')
const config = require('./config.json')
const ms = require('ms')
require('dotenv/config')

const bot = new Discord.Client()
bot.login(process.env.DISCORD_TOKEN)

bot.once('ready', () => {
  console.log("Bot Ready");
})

let muteTimeout;

bot.on("message", async message => {
  if (message.author.bot) return
  if (message.channel.type === "dm") return

  if (!message.member.hasPermission("ADMINISTRATOR")) {
    message.reply("Hoje não")
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command === "kick") {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    member.kick().then(() => {
      message.reply(`Membro ${user.tag} kickado`)
    })
  }

  if (command === "ban") {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    member.ban({
      reason: 'Muita viadagi'
    })
      .then(() => {
        message.reply(`Membro ${user.tag} banido`)
      })
  }

  if (command === "mute") {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    // let muterole = message.guild.roles.cache.get('734460711249379368')
    // let verifiedRole = message.guild.roles.cache.get('734474317118570596')

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

      muteTimeout = setTimeout(() => {
        try {
          if (muterole) {
            member.roles.remove(muterole.id)
            message.channel.send(`${member} desmutado`)
            message.guild.roles.cache.get(muterole.id).delete()
          }
        } catch (error) {
          console.log(error);
        }
      }, 10000)

    } catch (error) {
      console.log(error);
    }

  }

  if (command === "unmute") {
    const user = message.mentions.users.first();
    const member = message.guild.member(user)

    const muterole = message.guild.roles.cache.get('@muterole');

    if (muterole) {
      try {
        clearTimeout(muteTimeout)
        member.roles.remove(muterole.id)
        message.channel.send(`${member} desmutado`)
        message.guild.roles.cache.get(muterole.id).delete()
      } catch (error) {
        console.log(error);
      }
    }
  }
})