const { Client } = require('discord.js');
const ms = require('ms');
const estadisdb = require('../schemas/stats');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {

    const servers = client.guilds.cache

    setInterval(() => {

        servers.forEach(async (g) => {

            await estadisdb.findOne({ serverid: g.id }).then(async (datos) => {

                if (!datos) return

                const usuarios = g.members.cache.filter((m) => !m.user.bot).size
                const bots = g.members.cache.filter((m) => m.user.bot).size

                const canaluser = g.channels.cache.get(datos.canaluser.canalid)
                if (canaluser) {
                    const nombre = datos.canaluser.nombre
                    await canaluser.edit({ name: `${nombre}`.replace('{members}', usuarios) }).catch((error) => { })
                }

                const canalbot = g.channels.cache.get(datos.canalbot.canalid)
                if (canalbot) {
                    const nombre = datos.canalbot.nombre
                    await canalbot.edit({ name: `${nombre}`.replace('{bots}', bots) }).catch((error) => { })
                }

            }).catch((error) => console.log(error))
        })

    }, ms('10m'))
}