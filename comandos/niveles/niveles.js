const { Client, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const nivelesdb = require('../../schemas/niveles');

module.exports = {
    name: 'niveles',
    description: 'sistema de niveles',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'niveles',
    options: [
        {
            name: 'configurar',
            description: 'activar o desactivar el sistema de niveles',
            type: 2,
            options: [
                {
                    name: 'activar',
                    description: 'activar el sistema de niveles',
                    type: 1,
                },
                {
                    name: 'desactivar',
                    description: 'desactivar el sistema de niveles',
                    type: 1,
                },
                {
                    name: 'modificar',
                    description: 'modifica la imagen de la tarjeta',
                    type: 1,
                    options: [
                        {
                            name: 'imagen',
                            description: 'proporciona una imagen',
                            type: 3,
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'canal',
            description: 'establecer el canal para las notificaciones',
            type: 2,
            options: [
                {
                    name: 'seleccionar',
                    description: 'configura el canal',
                    type: 1,
                    options: [
                        {
                            name: 'canal',
                            description: 'proporciona un canal',
                            channelTypes: 0,
                            type: 7,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'restablecer',
                    description: 'restablece el canal de notificaciones a ninguno',
                    type: 1,
                },
            ],
        },
        {
            name: 'recompensa',
            description: 'agrega o remueve un rol de recompensa',
            type: 2,
            options: [
                {
                    name: 'agregar',
                    description: 'agrega un rol a un nivel especifico',
                    type: 1,
                    options: [
                        {
                            name: 'nivel',
                            description: 'selecciona el nivel para el rol',
                            type: 4,
                            required: true
                        },
                        {
                            name: 'rol',
                            description: 'selecciona el rol para el nivel',
                            type: 8,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remover',
                    description: 'remueve recompensa de rol de un nivel especifico',
                    type: 1,
                    options: [
                        {
                            name: 'nivel',
                            description: 'selecciona el nivel para remover la recompensa de rol',
                            type: 4,
                            required: true,
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

        const { options, user, guild, member } = interaction

        const subcomandos = options.getSubcommandGroup()
        const opciones = options.getSubcommand()

        await nivelesdb.findOne({ serverid: guild.id }).then(async (datos) => {

            switch (subcomandos) {

                case 'configurar': {

                    switch (opciones) {

                        case 'activar': {

                            if (!datos) {

                                datos = new nivelesdb({

                                    servername: guild.name,
                                    serverid: guild.id,
                                    activado: true
                                })

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Activado con éxito el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} el sistema ya esta activado!`)
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
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                await datos.deleteOne()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Desactivado con éxito el sistema de niveles!`)
                                    ]
                                })
                            }

                        }
                            break;

                        case 'modificar': {

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                const imagen = options.getString('imagen')

                                if (imagen && !imagen.includes('http')) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`
                                                ⚠ | Lo siento ${user} tienes que proporcionar una imagen valida!
                                                
                                                **Ejemplo:**
                                                \`1- http://ejemplo.com/imagen.png\`
                                                \`2- https://ejemplo2.com/imagen2.png\`
                                                `)
                                        ]
                                    })
                                }

                                datos.imagen = imagen

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription('✅ | Agregada con éxito la nueva imagen para las tarjetas!')
                                    ]
                                })
                            }

                        }
                            break;

                    }

                }
                    break;

                case 'canal': {

                    switch (opciones) {

                        case 'seleccionar': {

                            const canal = options.getChannel('canal')

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                datos.canalname = canal.name
                                datos.canalid = canal.id

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Establecido con éxito el canal ${canal} para las notificaciones!`)
                                    ]
                                })
                            }

                        }
                            break;

                        case 'restablecer': {

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                if (!datos.canalid) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} no has configurado ningún canal para las notificaciones!`)
                                        ]
                                    })
                                }

                                datos.canalname = undefined
                                datos.canalid = undefined

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Eliminado con éxito el canal de notificaciones!`)
                                    ]
                                })
                            }

                        }
                            break;

                    }

                }
                    break;

                case 'recompensa': {

                    switch (opciones) {

                        case 'agregar': {

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                const nivel = options.getInteger('nivel')
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

                                if (member.roles.highest.position <= rol.position) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} el rol que intentas gestionar es igual o más alto que el tuyo!`)
                                        ]
                                    })
                                }

                                const recom = datos.recompensas.find((n) => n.nivel === nivel)
                                const recrol = datos.recompensas.find((r) => r.rolid === rol.id)

                                if (recom) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} ya has agregado este nivel!`)
                                        ]
                                    })
                                }

                                if (recrol) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} ya has agregado este rol!`)
                                        ]
                                    })
                                }

                                if (datos.recompensas.length >= 20) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} solamente puedes agregar 20 recompensas de roles!`)
                                        ]
                                    })
                                }

                                const objeto = {

                                    nivel: nivel,
                                    rolname: rol.name,
                                    rolid: rol.id
                                }

                                datos.recompensas.push(objeto)

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Agregada con éxito la recompensa al sistema de niveles!`)
                                    ]
                                })

                            }

                        }
                            break;

                        case 'remover': {

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de niveles!`)
                                    ]
                                })

                            } else if (datos) {

                                const nivel = options.getInteger('nivel')
                                const recom = datos.recompensas.find((n) => n.nivel === nivel)

                                if (!recom) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} esa recompensa no existe en mi base de datos!`)
                                        ]
                                    })

                                } else {

                                    const remover = datos.recompensas.filter((n) => n.nivel !== nivel)

                                    datos.recompensas = remover

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Eliminada con éxito la recompensa del sistema de niveles!`)
                                        ]
                                    })
                                }
                            }

                        }
                            break;
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
                            .setDescription(`⚠ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                    ]
                })
            }
        })
    }
}