const Discord = require('discord.js')
const config = require('./config.json')
const kick = require('./commands/kick')
const ban = require('./commands/ban')
const { mute } = require('./commands/mute')
const { unmute } = require('./commands/unmute')
const { EventEmitter } = require('events')

require('dotenv/config')

const bot = new Discord.Client()
const emitter = new EventEmitter()

bot.login(process.env.DISCORD_TOKEN)

bot.once('ready', () => {
  console.log("Bot Ready");
})

bot.on("message", async message => {
  if (message.author.bot) return
  if (message.channel.type === "dm") return
  if (!message.member.hasPermission("ADMINISTRATOR")) return

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command === "kick") {
    await kick(message)
  }

  if (command === "ban") {
    await ban(message)
  }

  if (command === "mute") {
    await mute(message, emitter)
  }

  if (command === "unmute") {
    await unmute(message, emitter)
  }
})