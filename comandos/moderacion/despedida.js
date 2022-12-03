const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const despedidasdb = require('../../schemas/despedidas');

module.exports = {
    name: 'despedida',
    description: 'sistema de despedida',
    UserPerms: ["Administrator"],
    BotPerms: ['Administrator'],
    category: 'moderación',
    options: [
        {
            name: 'activar',
            description: 'configura el sistema de despedidas',
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
            description: 'personaliza el sistema de despedidas',
            type: 1,
            options: [
                {
                    name: 'imagen',
                    description: 'proporciona una imagen para el embed',
                    type: 3,
                    required: false,
                },
                {
                    name: 'canal',
                    description: 'proporciona un canal para las notificaciones',
                    channelTypes: 0,
                    type: 7,
                    required: false,
                },
            ],
        },
        {
            name: 'desactivar',
            description: 'desactiva el sistema de despedidas',
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

        await despedidasdb.findOne({ serverid: guild.id }).then(async (datos) => {

            switch (opciones) {

                case 'activar': {

                    const canal = options.getChannel('canal')

                    if (!datos) {

                        datos = new despedidasdb({

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
                                    .setDescription('✅ | configurado con éxito el sistema de despedidas!')
                            ]
                        })

                    } else if (datos) {

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`⚠ | Lo siento ${user} el sistema de despedidas ya está activado!`)
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
                                    .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de despedidas!`)
                            ]
                        })

                    } else if (datos) {

                        const imagen = options.getString('imagen') || datos.imagen
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

                        if (canal) {

                            datos.imagen = imagen
                            datos.canalname = canal.name
                            datos.canalid = canal.id

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Modificado con éxito el sistema de despedidas!')
                                ]
                            })

                        } else {

                            datos.imagen = imagen

                            await datos.save()

                            return interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(client.color)
                                        .setDescription('✅ | Modificado con éxito el sistema de despedidas!')
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
                                    .setDescription(`⚠ | Lo siento ${user} aún no has activado el sistema de despedidas!`)
                            ]
                        })

                    } else if (datos) {

                        await datos.deleteOne()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription('✅ | Desactivado con éxito el sistema de despedidas!')
                            ]
                        })
                    }

                }
                    break;
            }

        }).catch((error) => {
            console.log(error)
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