const { ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require('ms');
const logsadmin = require('../../schemas/logs');

module.exports = {
    name: 'ban',
    description: 'banear a usuario del servidor',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    caregory: 'moderación',
    options: [
        {
            name: 'usuario',
            description: 'proporciona un usuario a banear',
            type: 6,
            required: true,
        },
        {
            name: 'razon',
            description: 'proporciona una razón',
            type: 3,
            required: false,
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { user, options, member, guild } = interaction

        await logsadmin.findOne({ serverid: guild.id }).then(async (datos) => {

            const usuario = options.getMember('usuario')
            const razon = options.getString('razon') || 'Sin razón proporcionada'

            if (usuario.id === user.id) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} no puedes banearte a ti mismo!`)
                    ]
                })
            }

            if (guild.ownerId === usuario.id) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} no puedes banear al dueño del servidsor!`)
                    ]
                })
            }

            if (guild.members.me.roles.highest.position <= usuario.roles.highest.position) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} no puedo banear a un usuario con un rol igual o más alto que el mio!`)
                    ]
                })
            }

            if (member.roles.highest.position <= usuario.roles.highest.position) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} no puedo banear a un usuario con un rol igual o más alto que el tuyo!`)
                    ]
                })
            }

            if (usuario.permissions.has('Administrator')) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} no puedo banear a un administrador!`)
                    ]
                })
            }

            if (!usuario) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} ese usuario no éxiste en este servidor!`)
                    ]
                })
            }

            const estado = {
                'online': '🟢',
                'idle': '🟠',
                'dnd': '🔴',
                'offline': '⚫'
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `${usuario.user.tag}`, iconURL: `${usuario.user.displayAvatarURL()}` })
                .setThumbnail(`${usuario.user.displayAvatarURL()}`)
                .setDescription(`
            **⚠️ | Realmente quieres banear a este usuario?**

            **General**
            *Nombre:* \`${usuario.user.username}\`
            *Tag:* \`${usuario.user.tag}\`
            *ID:* \`${usuario.user.id}\`

            **Roles:** ${usuario.roles.cache.map((r) => r).join(' ').replace('@everyone', ' ') || 'Ninguno'}
            **Cuenta creada:** <t:${parseInt(usuario.user.createdTimestamp / 1000)}:R>
            **Miembro desde:** <t:${parseInt(usuario.joinedTimestamp / 1000)}:R>
            **Estado:** ${estado[usuario.presence ? usuario.presence.status : 'offline']} ${usuario.presence ? usuario.presence.status : 'offline'}
            **Es un bot?:** \`${usuario.user.bot ? 'Si' : 'No'}\`

            ⚠️ | \`Tienes 30 segundos para elegir una opción!\`
            `)
                .setFooter({ text: `Moderador: ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setTimestamp()

            const row = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('bBan-Si')
                    .setLabel('Si')
                    .setEmoji('⚠️'),

                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('bBan-No')
                    .setLabel('No')
                    .setEmoji('❓')
            )

            const pagina = await interaction.editReply({ embeds: [embed], components: [row] })

            const col = await pagina.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: ms('30s')
            })

            col.on('collect', async (i) => {

                if (i.user.id !== user.id) return

                switch (i.customId) {

                    case 'bBan-Si': {

                        await usuario.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | Fuiste baneado de **${guild.name}**\n\nRazón: ${razon}`)
                                    .setFooter({ text: `Enviado del servidor ${guild.name}`, iconURL: `${client.user.displayAvatarURL()}` })
                                    .setTimestamp()
                            ]
                        }).catch((error) => { })

                        if (datos && datos.ban === true) {

                            const logs = guild.channels.cache.get(datos.canalid)

                            logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`⚠️ | ${usuario.user.tag} fue baneado del servidor!\n\nRazón: ${razon}`)
                                        .setFooter({ text: `Moderador ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                                        .setTimestamp()
                                ]
                            }).catch((error) => { })
                        }

                        await guild.members.ban(usuario.id, { reason: razon }).catch((error) => { })

                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | ${usuario.user.tag} fue baneado!\n\nRazón: **${razon}**`)
                            ],
                            components: []
                        })

                    }
                        break;

                    case 'bBan-No': {

                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | el comando fue cancelado!`)
                            ],
                            components: []
                        })

                    }
                        break;
                }
            })

            col.on('end', (collected) => {

                if (collected.size > 0) return

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user}, el tiempo se ha agotado!`)
                    ],
                    components: []
                })
            })

        }).catch((error) => {
            console.log(error)

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠️ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                ]
            })
        })
    }
}