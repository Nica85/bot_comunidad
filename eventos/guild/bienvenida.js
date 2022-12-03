const { GuildMember, Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const bienvenidadb = require('../../schemas/bienvenidas');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {

        const { user, guild } = member

        if (!guild) return

        await bienvenidadb.findOne({ serverid: guild.id }).then(async (datos) => {

            if (!datos) return

            const bienvenida = new canvacord.Welcomer()
                .setUsername(`${user.username}`)
                .setDiscriminator(`${user.discriminator}`)
                .setGuildName(`${guild.name}`)
                .setAvatar(`${user.displayAvatarURL()}`)
                .setBackground(`${datos.imagen}`)
                .setColor('title', '#2f35e0')
                .setColor('title-border', '#ffffff')
                .setColor('avatar', '#2f35e0')
                .setColor('username', '#000000')
                .setColor('username-box', '#c6e2ff')
                .setColor('hashtag', '#faebd7')
                .setColor('discriminator', '#000000')
                .setColor('discriminator-box', '#2f35e0')
                .setColor('message', '#faebd7')
                .setColor('message-box', '#2f35e0')
                .setColor('background', '#2f35e0')
                .setColor('border', '#faebd7')

            const contenido = datos.contenido.replace('{user}', user).replace('{server}', guild.name)
            const mensaje = datos.mensaje.replace('{user}', user).replace('{server}', guild.name).replace('{members}', guild.memberCount)
            const canal = guild.channels.cache.get(datos.canalid)
            const rol = guild.roles.cache.get(datos.rolid)

            if (rol) {

                await member.roles.add(rol)
            }

            const tarjeta = await bienvenida.build()
            const attachment = new AttachmentBuilder(tarjeta, { name: 'welcomer.png' })

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setDescription(`${mensaje}`)
                .setImage('attachment://welcomer.png')
                .setTimestamp()
            if (guild.iconURL) embed.setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })

            await canal.send({ content: contenido, embeds: [embed], files: [attachment] })
            user.send({ content: contenido, embeds: [embed], files: [attachment] })

        }).catch((error) => { })
    }
}