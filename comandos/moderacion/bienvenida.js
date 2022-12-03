const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const bienvenidadb = require('../../schemas/bienvenidas');

module.exports = {
    name: 'bienvenida',
    description: 'sistema de bienvenidas',
    UserPerms: ["Administrator"],
    BotPerms: ['Administrator'],
    category: 'moderación',
    options: [
        {
            name: 'activar',
            description: 'configura el sistema de bienvenidas',
            type: 1,
            options: [
                {
                    name: 'canal',
                    description: 'proporciona un canal para las notificaciones',
                    channelTypes: 0,
                    type: 7,
                    required: true,
                },
            ],
        },
        {
            name: 'personalizar',
            description: 'personaliza el sistema de bienvenidas',
            type: 1,
            options: [
                {
                    name: 'canal',
                    description: 'proporciona un canal para las notificaciones',
                    channelTypes: 0,
                    type: 7,
                    required: false,
                },
                {
                    name: 'contenido',
                    description: 'proporciona un contenido al inicio el embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'mensaje',
                    description: 'proporciona un mensaje para el embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'imagen',
                    description: 'proporciona una imagen para el embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'rol',
                    description: 'proporciona un rol para los nuevos usuarios',
                    type: 8,
                    required: false,
                },
            ],
        },
        {
            name: 'remover',
            description: 'remueve el rol que se otorga a los nuevos usuarios',
            type: 1,
            options: [
                {
                    name: 'opcion',
                    description: 'elimina el rol',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'rol',
                            value: 'rol',
                        },
                    ],
                },
            ],
        },
        {
            name: 'desactivar',
            description: 'desactiva el sistema de bienvenidas',
            type: 1,
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { guild, options, user, member } = interaction

        const opciones = options.getSubcommand()

        await bienvenidadb.findOne({ serverid: guild.id }).then(async (datos) => {

            switch (opciones) {

                case 'activar': {

                    const canal = options.getChannel('canal')

                    if (!datos) {

                        datos = new bienvenidadb({

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
                                    .setDescription('✅ | configurado con éxito el sistema de bienvenidas!')
                            ]
                        })

                    } else if (datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el sistema de bienvenidas ya está activado!`)
                            ]
                        })
                    }

                }
                    break;

                case 'personalizar': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de bienvenidas!`)
                            ]
                        })

                    } else if (datos) {

                        const contenido = options.getString('contenido') || datos.contenido
                        const mensaje = options.getString('mensaje') || datos.mensaje
                        const imagen = options.getString('imagen') || datos.imagen
                        const rol = options.getRole('rol')
                        const canal = options.getChannel('canal')

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

                        if (rol) {

                            if (guild.members.me.roles.highest.position <= rol.position) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} el rol que intentas agregar es igual o más alto que el mio!`)
                                    ]
                                })
                            }

                            if (member.roles.highest.position <= rol.position) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} el rol que intentas agregar es igual o más alto que el tuyo!`)
                                    ]
                                })
                            }

                            if (rol.permissions.has('Administrator') || rol.permissions.has('BanMembers') || rol.permissions.has('KickMembers') || rol.permissions.has('ManageGuild') || rol.permissions.has('ManageRoles') || rol.permissions.has('ModerateMembers')) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(` ⚠ | Lo siento ${user} el rol no puede tener permisos superiores!`)
                                    ]
                                })
                            }

                            datos.contenido = contenido.split('+n+').join('\n')
                            datos.mensaje = mensaje.split('+n+').join('\n')
                            datos.imagen = imagen
                            datos.rolname = rol.name
                            datos.rolid = rol.id
                            if (canal) {
                                datos.canalname = canal.name
                                datos.canalid = canal.id
                            }

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Modificado con éxito el sistema de bienvenidas!')
                                ]
                            })

                        } else {

                            datos.contenido = contenido.split('+n+').join('\n')
                            datos.mensaje = mensaje.split('+n+').join('\n')
                            datos.imagen = imagen
                            if (canal) {
                                datos.canalname = canal.name
                                datos.canalid = canal.id
                            }

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Modificado con éxito el sistema de bienvenidas!')
                                ]
                            })
                        }
                    }

                }
                    break;

                case 'remover': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de bienvenidas!`)
                            ]
                        })

                    } else if (datos) {

                        const rol = options.getString('opcion')

                        if (rol) {

                            datos.rolname = undefined
                            datos.rolid = undefined

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Eliminado con éxito el rol otorgado a los nuevos usuarios!')
                                ]
                            })

                        }
                    }

                }
                    break;

                case 'desactivar': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de bienvenidas!`)
                            ]
                        })

                    } else if (datos) {

                        await datos.deleteOne()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription('✅ | Desactivado con éxito el sistema de bienvenidas!')
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
                            .setDescription(`⚠ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                    ]
                })
            }
        })
    }
}