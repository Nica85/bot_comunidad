const { Client, Presence } = require('discord.js');
const streamroldb = require('../../schemas/streamrol');

module.exports = {
    name: 'presenceUpdate',

    /**
     * 
     * @param {Presence} newPresence 
     * @param {Client} client 
     */
    async execute(newPresence, client) {

        const { guild, user, member } = newPresence

        if (!guild) return
        if (user.bot) return

        let datos = await streamroldb.findOne({ serverId: guild.id }).catch((error) => { })
        if (!datos) return

        const rol = guild.roles.cache.get(datos.rolId)
        if (!rol) return

        const actual = newPresence.activities.map((t) => t.type)

        if (actual.includes(1)) {

            member.roles.add(rol).catch((error) => { })

        } else {

            member.roles.remove(rol).catch((error) => { })
        }
    }
}