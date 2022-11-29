const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const { loadcommands, loadevents, loadhandlers } = require('../../funciones/funcionesbot');

module.exports = {
    name: 'reload',
    description: 'recargar las funciones del bot',
    UserPerms: ['Administrator'],
    BotPerms: ['Administrator'],
    category: 'dueño',
    options: [
        {
            name: 'opciones',
            description: 'selecciona una de las opciones',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'comandos',
                    value: 'comandos'
                },
                {
                    name: 'eventos',
                    value: 'eventos'
                },
                {
                    name: 'todo',
                    value: 'todo'
                },
            ],
        },
    ],
    owner: true,


    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, options } = interaction

        try {

            const opciones = options.getString('opciones')

            switch (opciones) {

                case 'comandos': {

                    loadcommands(client).then(() => {

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription('✅ | Comandos recargados con éxito!')
                            ],
                            ephemeral: true
                        })
                    }).catch((error) => { })

                }
                    break

                case 'eventos': {

                    loadevents(client).then(() => {

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription('✅ | Eventos recargados con éxito!')
                            ],
                            ephemeral: true
                        })
                    }).catch((error) => { })

                }
                    break;

                case 'todo': {

                    loadevents(client).then(() => {

                        loadhandlers(client).then(() => {

                            loadcommands(client).then(() => {

                                return interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(client.color)
                                            .setDescription('✅ | Recargadas todas las funciones del bot con éxito!')
                                    ],
                                    ephemeral: true
                                })
                            }).catch((error) => { })
                        }).catch((error) => { })
                    }).catch((error) => { })

                }
                    break;
            }

        } catch (error) {
            console.log(error)

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                ],
                ephemeral: true
            })
        }
    }
}