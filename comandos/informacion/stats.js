const { ChatInputCommandInteraction, EmbedBuilder, Client, ChannelType } = require('discord.js');
const estadisdb = require('../../schemas/stats');

module.exports = {
    name: 'estadisticas',
    description: 'configura contadores de usuarios o bots',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'información',
    options: [
        {
            name: 'crear',
            description: 'configura el sistema de estadísticas de usuarios',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'miembros',
                            value: 'members',
                        },
                        {
                            name: 'bots',
                            value: 'bots',
                        },
                    ],
                },
                {
                    name: 'categoria',
                    description: 'proporciona una categoria para el contador',
                    type: 7,
                    required: true,
                },
                {
                    name: 'rol',
                    description: 'proporciona el rol que podrá ver el canal',
                    type: 8,
                    required: true,
                },
            ],
        },
        {
            name: 'personalizar',
            description: 'personaliza el mensaje de las estadisticas',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'miembros',
                            value: 'members',
                        },
                        {
                            name: 'bots',
                            value: 'bots',
                        },
                    ],
                },
                {
                    name: 'nombre',
                    description: 'proporciona el nuevo nombre a mostrar',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'remover',
            description: 'remover uno de los contadores',
            type: 1,
            options: [
                {
                    name: 'opciones',
                    description: 'selecciona una de las opciones',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'miembros',
                            value: 'members',
                        },
                        {
                            name: 'bots',
                            value: 'bots',
                        },
                    ],
                },
            ],
        },
        {
            name: 'desactivar',
            description: 'desactiva el sistema de contadores',
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

        const { user, guild, options, member } = interaction

        await estadisdb.findOne({ serverid: guild.id }).then(async (datos) => {

            const opciones = options.getSubcommand()

            switch (opciones) {

                case 'crear': {

                    const opciones = options.getString('opciones')
                    const categoria = options.getChannel('categoria')
                    const rol = options.getRole('rol')

                    if (categoria.type !== ChannelType.GuildCategory) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} la categoría seleccionada no es valida!`)
                            ]
                        })
                    }

                    if (rol.name.includes('everyone') || rol.permissions.has('Administrator') || guild.members.me.roles.highest.position <= rol.position || member.roles.highest.position <= rol.position) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`
                                    ⚠ | Lo siento ${user} ocurrió un error al intentar agregar el rol!
                                    
                                    Posibles causas:
                                    🔸 El rol no puede ser \`everyone!\`
                                    🔸 El rol no puede ser \`administrador!\`
                                    🔸 El rol es igual o más alto que el \`mio!\`
                                    🔸 El rol es igual o más alto que el \`tuyo!\`
                                    `)
                            ]
                        })
                    }

                    switch (opciones) {

                        case 'members': {

                            if (!datos) {

                                const cantidad = guild.members.cache.filter((m) => !m.user.bot).size

                                const canal = await guild.channels.create({

                                    name: `🔷 Usuarios: ${cantidad}`,
                                    parent: `${categoria.id}`,
                                    type: ChannelType.GuildVoice,
                                    permissionOverwrites: [
                                        {
                                            id: guild.id,
                                            deny: ['ViewChannel'],
                                        },
                                        {
                                            id: rol.id,
                                            allow: ['ViewChannel'],
                                            deny: ['Connect', 'SendMessages', 'ReadMessageHistory', 'CreatePrivateThreads', 'CreatePublicThreads']
                                        },
                                    ],

                                })

                                datos = new estadisdb({

                                    servername: guild.name,
                                    serverid: guild.id,
                                    canaluser: {
                                        canalname: canal.name,
                                        canalid: canal.id,
                                        rolname: rol.name,
                                        rolid: rol.id,
                                        nombre: '🔷 Usuarios: {members}'
                                    }
                                })

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Creado con éxito el contador de usuarios en la categoría ${categoria}`)
                                    ]
                                })

                            } else if (datos) {

                                if (!datos.canaluser.canalid) {

                                    const cantidad = guild.members.cache.filter((m) => !m.user.bot).size

                                    const canal = await guild.channels.create({

                                        name: `🔷 Usuarios: ${cantidad}`,
                                        parent: `${categoria.id}`,
                                        type: ChannelType.GuildVoice,
                                        permissionOverwrites: [
                                            {
                                                id: guild.id,
                                                deny: ['ViewChannel'],
                                            },
                                            {
                                                id: rol.id,
                                                allow: ['ViewChannel'],
                                                deny: ['Connect', 'SendMessages', 'ReadMessageHistory', 'CreatePrivateThreads', 'CreatePublicThreads']
                                            },
                                        ],

                                    })

                                    datos.canaluser.canalname = canal.name
                                    datos.canaluser.canalid = canal.id
                                    datos.canaluser.rolname = rol.name
                                    datos.canaluser.rolid = rol.id
                                    datos.canaluser.nombre = '🔶 Usuarios: {members}'

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Creado con éxito el contador de usuarios en la categoría ${categoria}`)
                                        ]
                                    })

                                } else {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} ya tienes un contador de usurios!`)
                                        ]
                                    })
                                }
                            }

                        }
                            break;

                        case 'bots': {

                            if (!datos) {

                                const cantidad = guild.members.cache.filter((m) => m.user.bot).size

                                const canal = await guild.channels.create({

                                    name: `🔶 Bots: ${cantidad}`,
                                    parent: `${categoria.id}`,
                                    type: ChannelType.GuildVoice,
                                    permissionOverwrites: [
                                        {
                                            id: guild.id,
                                            deny: ['ViewChannel'],
                                        },
                                        {
                                            id: rol.id,
                                            allow: ['ViewChannel'],
                                            deny: ['Connect', 'SendMessages', 'ReadMessageHistory', 'CreatePrivateThreads', 'CreatePublicThreads']
                                        },
                                    ],

                                })

                                datos = new estadisdb({

                                    servername: guild.name,
                                    serverid: guild.id,
                                    canalbot: {
                                        canalname: canal.name,
                                        canalid: canal.id,
                                        rolname: rol.name,
                                        rolid: rol.id,
                                        nombre: '🔶 Bots: {bots}'
                                    }
                                })

                                await datos.save()

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Creado con éxito el contador de bots en la categoría ${categoria}`)
                                    ]
                                })

                            } else if (datos) {

                                if (!datos.canalbot.canalid) {

                                    const cantidad = guild.members.cache.filter((m) => m.user.bot).size

                                    const canal = await guild.channels.create({

                                        name: `🔶 Bots: ${cantidad}`,
                                        parent: `${categoria.id}`,
                                        type: ChannelType.GuildVoice,
                                        permissionOverwrites: [
                                            {
                                                id: guild.id,
                                                deny: ['ViewChannel'],
                                            },
                                            {
                                                id: rol.id,
                                                allow: ['ViewChannel'],
                                                deny: ['Connect', 'SendMessages', 'ReadMessageHistory', 'CreatePrivateThreads', 'CreatePublicThreads']
                                            },
                                        ],

                                    })

                                    datos.canalbot.canalname = canal.name
                                    datos.canalbot.canalid = canal.id
                                    datos.canalbot.rolname = rol.name
                                    datos.canalbot.rolid = rol.id
                                    datos.canalbot.nombre = '🔶 Bots: {bots}'

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Creado con éxito el contador de bots en la categoría ${categoria}`)
                                        ]
                                    })

                                } else {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} ya tienes un contador de bots!`)
                                        ]
                                    })

                                }
                            }

                        }
                            break;
                    }

                }
                    break;

                case 'personalizar': {

                    if (!datos) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} aún no has creado ningún contador!`)
                            ]
                        })

                    } else if (datos) {

                        const opciones = options.getString('opciones')
                        const nombre = options.getString('nombre')

                        if (nombre.length >= 50) {
                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`⚠ | Lo siento ${user} el mesanje es demaciado largo!`)
                                ]
                            })
                        }

                        switch (opciones) {

                            case 'members': {

                                const canal = guild.channels.cache.get(datos.canaluser.canalid)
                                const usuarios = guild.members.cache.filter((m) => !m.user.bot).size

                                if (!canal) {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} aún no has creado el contador de usuarios!`)
                                        ]
                                    })

                                }

                                canal.setName(`${nombre}`.replace('{members}', usuarios)).then(async (chan) => {

                                    datos.canaluser.canalname = canal.name
                                    datos.canaluser.nombre = nombre

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Personalizado con éxito el canal ${chan}`)
                                        ]
                                    })
                                }).catch((error) => { })

                            }
                                break;

                            case 'bots': {

                                const canal = guild.channels.cache.get(datos.canalbot.canalid)
                                const bots = guild.members.cache.filter((m) => m.user.bot).size

                                if (!canal) {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} aún no has creado el contador de bots!`)
                                        ]
                                    })

                                }

                                canal.setName(`${nombre}`.replace('{bots}', bots)).then(async (chan) => {

                                    datos.canalbot.canalname = canal.name
                                    datos.canalbot.nombre = nombre

                                    await datos.save()

                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`✅ | Personalizado con éxito el canal ${chan}`)
                                        ]
                                    })
                                }).catch((error) => { })

                            }
                                break;
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
                                    .setDescription(`⚠ | Lo siento ${user} aún no has creado ningún contador!`)
                            ]
                        })

                    } else if (datos) {

                        const opciones = options.getString('opciones')

                        switch (opciones) {

                            case 'members': {

                                const canal = guild.channels.cache.get(datos.canaluser.canalid)

                                if (!canal) {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} aún no has creado el contador de usuarios!`)
                                        ]
                                    })

                                } else {

                                    canal.delete().then(async () => {

                                        datos.canaluser = undefined

                                        await datos.save()

                                        return interaction.editReply({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor(client.color)
                                                    .setDescription('✅ | Eliminado con éxito el contador de usuarios!')
                                            ]
                                        })
                                    }).catch((error) => { })
                                }

                            }
                                break;

                            case 'bots': {

                                const canal = guild.channels.cache.get(datos.canalbot.canalid)

                                if (!canal) {
                                    return interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(client.color)
                                                .setDescription(`⚠ | Lo siento ${user} aún no has creado el contador de bots!`)
                                        ]
                                    })

                                } else {

                                    canal.delete().then(async () => {

                                        datos.canalbot = undefined

                                        await datos.save()

                                        return interaction.editReply({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setColor(client.color)
                                                    .setDescription('✅ | Eliminado con éxito el contador de bots!')
                                            ]
                                        })
                                    }).catch((error) => { })
                                }

                            }
                                break;
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
                                    .setDescription(`⚠ | Lo siento ${user} aún no has creado ningún contador!`)
                            ]
                        })

                    } else if (datos) {

                        if (datos.canaluser.canalid && !datos.canalbot.canalid) {
                            const canal = guild.channels.cache.get(datos.canaluser.canalid)
                            canal.delete().catch((error) => { })

                        } else if (datos.canalbot.canalid && !datos.canaluser.canalid) {
                            const canal = guild.channels.cache.get(datos.canalbot.canalid)
                            canal.delete().catch((error) => { })

                        } else if (datos.canalbot.canalid && datos.canaluser.canalid) {
                            const canaluser = guild.channels.cache.get(datos.canaluser.canalid)
                            const canalbot = guild.channels.cache.get(datos.canalbot.canalid)

                            await canaluser.delete().catch((error) => { })
                            canalbot.delete().catch((error) => { })
                        }

                        await datos.deleteOne()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription('✅ | Eliminados con éxito todos los contadores del servidor!')
                            ]
                        })
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
                        .setDescription(`⚠ | Lo siento ${member} ocurrió un error al ejecutar el comando!\n\nSi esto continua contacta con [Nica]#1752 y repórtalo!`)
                ]
            })
        })
    }
}