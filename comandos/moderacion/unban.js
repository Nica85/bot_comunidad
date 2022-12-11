const { ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require('ms');
const logsadmin = require('../../schemas/logs');

module.exports = {
    name: 'unban',
    description: 'desbanea a usuario del servidor',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    caregory: 'moderación',
    options: [
        {
            name: 'usuario',
            description: 'proporciona el id del usuario a desbanear',
            type: 3,
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

        const { user, options, guild } = interaction

        await logsadmin.findOne({ serverid: guild.id }).then(async (datos) => {

            const id = options.getString('usuario')
            const razon = options.getString('razon') || 'Sin razón proporcionada'

            if (isNaN(id)) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} tienes que proporcionar una id valida!`)
                    ]
                })
            }

            const baneado = await guild.bans.fetch()
            if (!baneado.find((x) => x.user.id === id)) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠️ | Lo siento ${user} este usuario aún no ha sido baneado!`)
                    ]
                })
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription('**⚠️ | Realmente quieres desbanear a este usuario?**\n\n⚠️ | \`Tienes 30 segundos para elegir una opción!\`')
                .setFooter({ text: `Moderador: ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setTimestamp()

            const row = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('bUnban-Si')
                    .setLabel('Si')
                    .setEmoji('⚠️'),

                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('bUnban-No')
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

                    case 'bUnban-Si': {

                        await guild.members.unban(id, razon).then((users) => {

                            if (datos && datos.unban === true) {

                                const logs = guild.channels.cache.get(datos.canalid)

                                logs.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠️ | ${users.tag} fue desbaneado del servidor!\n\nRazón: ${razon}`)
                                            .setFooter({ text: `Moderador ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                                            .setTimestamp()
                                    ]
                                }).catch((error) => { })
                            }

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`✅ | ${users.tag} fue desbaneado!\n\nRazón: **${razon}**`)
                                ],
                                components: []
                            })

                        })

                    }
                        break;

                    case 'bUnban-No': {

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