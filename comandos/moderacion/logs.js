const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const logsadmin = require('../../schemas/logs');

module.exports = {
    name: 'logs',
    description: 'configura el sistema de logs',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    caregory: 'moderación',
    options: [
        {
            name: 'configurar',
            description: 'configura el canal de logs',
            type: 1,
            options: [
                {
                    name: 'canal',
                    description: 'proporciona el canal para los logs',
                    type: 7,
                    required: true,
                },
            ],
        },
        {
            name: 'ban',
            description: 'activa o desactiva los logs de baneados',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'activar',
                            value: 'true',
                        },
                        {
                            name: 'desactivar',
                            value: 'false',
                        },
                    ],
                },
            ],
        },
        {
            name: 'unban',
            description: 'activa o desactiva los logs de desbaneados',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'activar',
                            value: 'true',
                        },
                        {
                            name: 'desactivar',
                            value: 'false',
                        },
                    ],
                },
            ],
        },
        {
            name: 'kick',
            description: 'activa o desactiva los logs de expulsados',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'activar',
                            value: 'true',
                        },
                        {
                            name: 'desactivar',
                            value: 'false',
                        },
                    ],
                },
            ],
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { user, guild, options } = interaction

        const opciones = options.getSubcommand()

        await logsadmin.findOne({ serverid: guild.id }).then(async (datos) => {

            switch (opciones) {

                case 'configurar': {

                    const canal = options.getChannel('canal')

                    if (!datos) {

                        datos = new logsadmin({
                            servername: guild.name,
                            serverid: guild.id,
                            canalname: canal.name,
                            canalid: canal.id
                        })

                        await datos.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Configurado con éxito el canal ${canal} para los logs!`)
                            ]
                        })

                    } else if (datos) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | Lo siento ${user} ya has configurado el canal de logs!`)
                            ]
                        })
                    }

                }
                    break;

                case 'ban': {

                    const opciones = options.getString('opciones')

                    if (!datos) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | Lo siento ${user} aún no has configurado el canal de logs!`)
                            ]
                        })

                    } else if (datos) {

                        if (opciones === 'true') {

                            datos.ban = true
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Activado con éxito los logs para baneados!')
                                ]
                            })

                        } else {

                            datos.ban = false
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Desactivado con éxito los logs para baneados!')
                                ]
                            })
                        }
                    }

                }
                    break;

                case 'unban': {

                    const opciones = options.getString('opciones')

                    if (!datos) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | Lo siento ${user} aún no has configurado el canal de logs!`)
                            ]
                        })

                    } else if (datos) {

                        if (opciones === 'true') {

                            datos.unban = true
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Activado con éxito los logs para desbaneados!')
                                ]
                            })

                        } else {

                            datos.unban = false
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Desactivado con éxito los logs para desbaneados!')
                                ]
                            })
                        }
                    }

                }
                    break;

                case 'kick': {

                    const opciones = options.getString('opciones')

                    if (!datos) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠️ | Lo siento ${user} aún no has configurado el canal de logs!`)
                            ]
                        })

                    } else if (datos) {

                        if (opciones === 'true') {

                            datos.kick = true
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Activado con éxito los logs para expulsados!')
                                ]
                            })

                        } else {

                            datos.kick = false
                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Desactivado con éxito los logs para expulsados!')
                                ]
                            })
                        }
                    }

                }
                    break;
            }

        }).catch((error) => {
            console.log(error)

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠️ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                ]
            })
        })
    }
}