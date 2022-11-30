const { ChatInputCommandInteraction, Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const verificardb = require('../../schemas/verificacion');

module.exports = {
    name: 'verificar',
    description: 'sistema de verificacion',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'moderación',
    options: [
        {
            name: 'activar',
            description: 'activar el sistema de verificacion',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'proporciona un rol',
                    type: 8,
                    required: true,
                },
                {
                    name: 'canal',
                    description: 'proporciona un canal',
                    type: 7,
                    required: true,
                },
                {
                    name: 'cabecera',
                    description: 'proporciona una imagen de cabecera para el mensaje',
                    type: 3,
                    required: false,
                },
                {
                    name: 'titulo',
                    description: 'proporciona un titulo al embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'descripcion',
                    description: 'proporciona una descripcion para el embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'imagen',
                    description: 'proporciona una imagen para el embed',
                    type: 3,
                    required: false,
                },
            ],
        },
        {
            name: 'agregar',
            description: 'agrega otros roles',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'proporciona un rol',
                    type: 8,
                    required: true,
                },
            ],
        },
        {
            name: 'desactivar',
            description: 'desactiva el sistema de verificacion',
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

        const { guild, user, options } = interaction

        await verificardb.findOne({ serverId: guild.id }).then(async (datos) => {

            const opciones = options.getSubcommand()

            switch (opciones) {

                case 'activar': {

                    const rol = options.getRole('rol')
                    const canal = options.getChannel('canal')
                    const cabecera = options.getString('cabecera')
                    const titulo = options.getString('titulo') || '✅ | verificate'
                    const descripcion = options.getString('descripcion') || 'Click en el botón para verificarte'
                    const imagen = options.getString('imagen')
                    let mensajeid

                    if (guild.members.me.roles.highest.position <= rol.position) {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el rol que intentas gestionar es igual o más alto que el mio!`)
                            ]
                        })
                    }

                    if (rol.name.includes('everyone')) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} no puedes agregar el rol everyone!`)
                            ]
                        })
                    }

                    if (!datos) {

                        const archivo = new AttachmentBuilder(cabecera, { name: 'verificacion' })
                        const embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(`${titulo}`)
                            .setDescription(`${descripcion}`.split('+n+').join('\n'))
                            .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                            .setTimestamp()
                        if (imagen && imagen.includes('http')) embed.setImage(`${imagen}`)

                        const row = new ActionRowBuilder().addComponents(

                            new ButtonBuilder()
                                .setCustomId('sVerificar')
                                .setLabel('Verificar')
                                .setStyle(ButtonStyle.Primary)
                        )

                        if (cabecera) {

                            await canal.send({ files: [archivo], embeds: [embed], components: [row] }).then((msg) => {

                                mensajeid = msg.id

                            }).catch((error) => { })

                            datos = new verificardb({

                                serverName: guild.name,
                                serverId: guild.id,
                                roles: [rol.id],
                                mensajeId: mensajeid,
                                canalName: canal.name,
                                canalId: canal.id
                            })

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`✅ | Configurado con éxito el sistema de verificación en el canal ${canal}!`)
                                ]
                            })

                        } else {

                            await canal.send({ embeds: [embed], components: [row] }).then((msg) => {

                                mensajeid = msg.id

                            }).catch((error) => { })

                            datos = new verificardb({

                                serverName: guild.name,
                                serverId: guild.id,
                                roles: [rol.id],
                                mensajeId: mensajeid,
                                canalName: canal.name,
                                canalId: canal.id
                            })

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`✅ | Configurado con éxito el sistema de verificación en el canal ${canal}!`)
                                ]
                            })
                        }

                    } else {

                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el sistema de verificación ya esta activado!`)
                            ]
                        })
                    }

                }
                    break;

                case 'agregar': {

                    if (!datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} no tengo datos en mi base de datos!`)
                            ]
                        })

                    } else if (datos) {

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

                        if (rol.name.includes('everyone')) {

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`⚠ | Lo siento ${user} no puedes agregar el rol everyone!`)
                                ]
                            })
                        }

                        datos.roles.push(rol.id)

                        await datos.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`✅ | Agregado con éxito el rol ${rol} la sistema de verificación!`)
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
                                    .setDescription(`⚠ | Lo siento ${user} no tengo datos en mi base de datos!`)
                            ]
                        })

                    } else {

                        const canal = guild.channels.cache.get(datos.canalId)
                        const mensaje = await canal.messages.fetch(datos.mensajeId)

                        if (mensaje) {

                            mensaje.delete()

                            await datos.deleteOne()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription(`✅ | Desactivado con éxito el sistema de verificación en el servidor`)
                                ]
                            })

                        } else {

                            await datos.deleteOne().then(() => {

                                return interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription(`✅ | Desactivado con éxito el sistema de verificación en el servidor`)
                                    ]
                                })
                            })
                        }
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