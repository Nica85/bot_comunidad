const { GuildMember, Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const despedidadb = require('../../schemas/despedidas');

module.exports = {
    name: 'guildMemberRemove',

    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {

        const { user, guild } = member

        if (!guild) return

        await despedidadb.findOne({ serverid: guild.id }).then(async (datos) => {

            if (!datos) return

            const despedida = new canvacord.Leaver()
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

            const canal = guild.channels.cache.get(datos.canalid)

            const tarjeta = await despedida.build()
            const attachment = new AttachmentBuilder(tarjeta, { name: 'leaver.png' })

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `${user.tag} abandono el servidor!`, iconURL: `${user.displayAvatarURL()}` })
                .setImage('attachment://leaver.png')
                .setTimestamp()
            if (guild.iconURL) embed.setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })

            canal.send({ embeds: [embed], files: [attachment] })

        }).catch((error) => { })
    }
}