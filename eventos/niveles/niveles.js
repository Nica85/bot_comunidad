const { Client, Message, EmbedBuilder } = require('discord.js');
const nivelesdb = require('../../schemas/niveles');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {

        const { author, guild, member } = message

        if (author.bot || !guild) return

        await nivelesdb.findOne({ serverId: guild.id }).then(async (datos) => {

            if (!datos) return

            const user = datos.usuarios.find((u) => u.userid === author.id)

            if (!user) {

                const objeto = {
                    username: author.tag,
                    userid: author.id,
                    xp: 0,
                    nivel: 0
                }

                datos.usuarios.push(objeto)
                await datos.save()

            } else {

                const otorgar = Math.floor(Math.random() * 29) + 1
                const xprequire = user.nivel * user.nivel * 100 + 100

                if (user.xp + otorgar >= xprequire) {

                    user.xp += otorgar
                    user.nivel += 1

                    await datos.save()

                    if (user.rolid) {

                        const rol = guild.roles.cache.get(user.rolid)

                        member.roles.remove(rol)
                    }

                    if (datos.canalid) {

                        const canal = guild.channels.cache.get(datos.canalid)

                        canal.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`🎉 | \`Felicidades has alcanzado el nivel ${user.nivel}\``)
                            ],
                            content: `${author}`
                        })
                    }

                } else {

                    user.xp += otorgar
                    await datos.save()
                }

                const roladd = datos.recompensas.find((n) => n.nivel === user.nivel)
                if (!roladd) return

                const nivelrol = guild.roles.cache.get(roladd.rolid)

                if (member.roles.cache.some((r) => r.id === nivelrol.id)) return

                member.roles.add(nivelrol)

                user.rolname = nivelrol.name
                user.rolid = nivelrol.id

                await datos.save()

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`🥳 | Felicidades has obtenido una nueva recompensa en ${guild.name}`)
                    .setTimestamp()
                if (guild.iconURL) embed.setFooter({ text: `Mensaje enviado del servidor ${guild.name}`, iconURL: `${guild.iconURL()}` })

                return member.send({ embeds: [embed] }).catch((error) => { })
            }
        })
    }
}