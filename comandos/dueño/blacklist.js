const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const blacklistdb = require('../../schemas/blacklist');
const config = require('../../botconfig/config.json');

module.exports = {
    name: 'blacklist',
    description: 'agregar a lista negra servidor o usuario para no utilizar el bot',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'dueño',
    options: [
        {
            name: 'agregar',
            description: 'selecciona una de las opciones',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una opcion',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'servidor',
                            value: 'server'
                        },
                        {
                            name: 'usuario',
                            value: 'users'
                        },
                    ],
                },
                {
                    name: 'id',
                    description: 'proporciona una ID de servidor o usuario',
                    type: 3,
                    required: true
                },
                {
                    name: 'razon',
                    description: 'proporciona una razon',
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: 'remover',
            description: 'selecciona una de las opciones',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una opcion',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'servidor',
                            value: 'server'
                        },
                        {
                            name: 'usuario',
                            value: 'users'
                        },
                    ],
                },
                {
                    name: 'id',
                    description: 'proporciona una ID de servidor o del usuario',
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: 'limpiar',
            description: 'eliminar toda la blacklist',
            type: 1,
        },
    ],
    owner: true,

    /**
     * 
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { user, options, guild } = interaction

        await interaction.deferReply({ ephemeral: true })

        if (guild.id !== config.servidor.id) {

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠ | Lo siento ${user} este comando solo puedes utilizarlo en mi servidor principal!`)
                ]
            })
        }

        await blacklistdb.findOne().then(async (datos) => {

            const opciones = options.getSubcommand()

            switch (opciones) {

                case 'agregar': {

                    const opciones = options.getString('opciones')

                    switch (opciones) {

                        case 'server': {

                            const razon = options.getString('razon')
                            const id = options.getString('id')
                            const blackserver = client.guilds.cache.get(id)

                            if (isNaN(id)) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del servidor no es valida!`)
                                    ]
                                })
                            }

                            if (!blackserver) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del servidor no esta en mi cache!`)
                                    ]
                                })
                            }

                            if (blackserver.id === config.servidor.id) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} no puedes agregar mi servidor principal!`)
                                    ]
                                })
                            }

                            if (!datos) {

                                datos = new blacklistdb({

                                    Servidores: [{

                                        servername: blackserver.name,
                                        serverid: blackserver.id,
                                        razon: razon,
                                        tiempo: Date.now()
                                    }]

                                })

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Agregado con éxito el servidor \`${blackserver.name}\` a la lista negra!`)
                                    ]
                                })

                            } else if (datos) {

                                const serverfind = datos.Servidores.find((s) => s.serverid === blackserver.id)

                                if (!serverfind) {

                                    const objeto = {

                                        servername: blackserver.name,
                                        serverid: blackserver.id,
                                        razon: razon,
                                        tiempo: Date.now()
                                    }

                                    datos.Servidores.push(objeto)

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Agregado con éxito el servidor \`${blackserver.name}\` a la lista negra!`)
                                        ]
                                    })

                                } else {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} este servidor ya esta agregado en la lista negra!`)
                                        ]
                                    })
                                }
                            }

                        }
                            break;

                        case 'users': {

                            const razon = options.getString('razon')
                            const id = options.getString('id')
                            const blackuser = client.users.cache.get(id)

                            if (isNaN(id)) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del usuario no es valida!`)
                                    ]
                                })
                            }

                            if (!blackuser) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del usuario no esta en mi cache!`)
                                    ]
                                })
                            }

                            if (blackuser.id === config.owners.nicaId) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} no puedes agregar a mi creador!`)
                                    ]
                                })
                            }

                            if (!datos) {

                                datos = new blacklistdb({

                                    Usuarios: [{

                                        username: blackuser.tag,
                                        userid: blackuser.id,
                                        razon: razon,
                                        tiempo: Date.now()
                                    }]

                                })

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Agregado con éxito el usuario \`${blackuser.tag}\` a la lista negra!`)
                                    ]
                                })

                            } else if (datos) {

                                const userfind = datos.Usuarios.find((u) => u.userid === blackuser.id)

                                if (!userfind) {

                                    const objeto = {

                                        username: blackuser.tag,
                                        userid: blackuser.id,
                                        razon: razon,
                                        tiempo: Date.now()
                                    }

                                    datos.Usuarios.push(objeto)

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Agregado con éxito el usuario \`${blackuser.tag}\` a la lista negra!`)
                                        ]
                                    })

                                } else {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} este usuario ya esta agregado en la lista negra!`)
                                        ]
                                    })
                                }
                            }

                        }
                            break;
                    }

                }
                    break;

                case 'remover': {

                    const opciones = options.getString('opciones')

                    switch (opciones) {

                        case 'server': {

                            const id = options.getString('id')

                            if (isNaN(id)) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del servidor no es valida!`)
                                    ]
                                })
                            }

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has agregado servidores a la lista negra!`)
                                    ]
                                })

                            } else if (datos) {

                                if (!datos.Servidores.length) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} la lista esta vacia!`)
                                        ]
                                    })
                                }

                                const remove = datos.Servidores.find((s) => s.serverid === id)

                                if (!remove) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} el servidor no éxiste en mi base de datos!`)
                                        ]
                                    })

                                } else {

                                    const remover = datos.Servidores.filter((s) => s.serverid !== id)

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Eliminado con éxito el servidor \`${remove.servername}\` de la lista negra!`)
                                        ]
                                    }).then(async () => {

                                        datos.Servidores = remover
                                        await datos.save()
                                    })
                                }
                            }

                        }
                            break;

                        case 'users': {

                            const id = options.getString('id')

                            if (isNaN(id)) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} la id del usuario no es valida!`)
                                    ]
                                })
                            }

                            if (!datos) {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`⚠ | Lo siento ${user} aún no has agregado usuarios a la lista negra!`)
                                    ]
                                })

                            } else if (datos) {

                                if (!datos.Usuarios.length) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} la lista esta vacia!`)
                                        ]
                                    })
                                }

                                const remove = datos.Usuarios.find((u) => u.userid === id)

                                if (!remove) {

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} este usuario no éxiste en mi base de datos!`)
                                        ]
                                    })

                                } else {

                                    const remover = datos.Usuarios.filter((u) => u.userid !== id)

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Eliminado con éxito el usuario \`${remove.username}\` de la lista negra!`)
                                        ]
                                    }).then(async () => {

                                        datos.Usuarios = remover
                                        await datos.save()
                                    })
                                }
                            }

                        }
                            break;
                    }

                }
                    break;

                case 'limpiar': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} no tengo datos en mi base de datos!`)
                            ]
                        })

                    } else if (datos) {

                        await datos.delete()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Eliminada con éxito la base de datos de la blacklist!`)
                            ]
                        })
                    }

                }
                    break;
            }

        }).catch((error) => {

            if (error) {
                console.log(error)

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