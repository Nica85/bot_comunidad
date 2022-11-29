const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js');
const { loadevents, loadhandlers } = require('./funciones/funcionesbot');
const ms = require('ms');

const client = new Client({
    closeTimeout: 5000,
    shards: 'auto',
    allowedMentions: {
        parse: ['everyone', 'roles', 'users'],
        repliedUser: false,
    },
    rest: { timeout: ms('1m') },
    failIfNotExists: false,
    presence: { activities: [{ name: 'Euro Truck Simululator 2', type: ActivityType.Streaming, url: 'http://twitch.tv/nicaina' }], status: 'online' },
    waitGuildTimeout: 15000,
    partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember, Partials.Channel, Partials.Reaction, Partials.GuildScheduledEvent],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.color = 'Random'
client.events = new Collection()
client.commands = new Collection()
client.timeout = new Collection()
loadevents(client)
loadhandlers(client)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = client
client.config = require('./botconfig/config.json')
client.login(client.config.bot.token).then(() => {
}).catch((error) => console.log(error))