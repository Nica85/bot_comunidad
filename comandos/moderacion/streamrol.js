const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const streamroldb = require('../../schemas/streamrol');

module.exports = {
    name: 'streamrol',
    description: 'configurar rol para streamers',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'moderación',
    options: [
        {
            name: 'activar',
            description: 'activa los roles de streamers',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'proporciona un rol para los streamers',
                    type: 8,
                    required: true,
                },
            ],
        },
        {
            name: 'modificar',
            description: 'modifica los roles de streamers',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'proporciona un rol para los streamers',
                    type: 8,
                    required: true,
                },
            ],
        },
        {
            name: 'desactivar',
            description: 'activa los roles de streamers',
            type: 1,
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, options, member } = interaction

        await interaction.deferReply({ ephemeral: true })

        const opciones = options.getSubcommand()

        await streamroldb.findOne({ serverId: guild.id }).then(async (datos) => {

            switch (opciones) {

                case 'activar': {

                    const rol = options.getRole('rol')

                    if (guild.members.me.roles.highest.position <= rol.position) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el rol que intentas gestionar es igual o más alto que el mio!`)
                            ]
                        })
                    }

                    if (!datos) {

                        datos = new streamroldb({

                            serverName: guild.name,
                            serverId: guild.id,
                            rolname: rol.name,
                            rolId: rol.id
                        })

                        await datos.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Agregado con éxito el rol ${rol}!`)
                            ]
                        })

                    } else if (datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el sistema ya esta activado! utiliza \`/streamrol modificar\``)
                            ]
                        })
                    }

                }
                    break;

                case 'modificar': {

                    const rol = options.getRole('rol')

                    if (guild.members.me.roles.highest.position <= rol.position) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el rol que intentas gestionar es igual o más alto que el mio!`)
                            ]
                        })
                    }

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} no tengo datos de tu servidor en mi base de datos! utiliza \`/streamrol activar\``)
                            ]
                        })

                    } else if (datos) {

                        datos.rolname = rol.name
                        datos.rolId = rol.id

                        await datos.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Modificado con éxito el rol para los streamers!`)
                            ]
                        })
                    }

                }
                    break;

                case 'desactivar': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} no tengo datos de tu servidor en mi base de datos! utiliza \`/streamrol activar\``)
                            ]
                        })

                    } else if (datos) {

                        await datos.deleteOne()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Desactivado con éxito los roles de streamers en tu servidor!`)
                            ]
                        })
                    }

                }
                    break;
            }

        }).catch((error) => {

            if (error) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | lo siento ${user} ocurrió un error al ejecutar el comando!`)
                    ]
                })
            }
        })
    }
}