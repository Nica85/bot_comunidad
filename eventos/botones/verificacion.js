const { Client, MessageComponentInteraction, InteractionType, EmbedBuilder } = require('discord.js');
const verificardb = require('../../schemas/verificacion');

module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param {MessageComponentInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { guild, member, customId, type } = interaction

        if (type !== InteractionType.MessageComponent) return

        const id = ['sVerificar']
        if (!id.includes(customId)) return

        await verificardb.findOne({ serverId: guild.id }).then(async (datos) => {

            await interaction.deferReply({ ephemeral: true })

            if (!datos) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Lo siento ${member} no tengo datos en mi base de datos!`)
                    ]
                })
            }

            const rol = datos.roles.slice(0, 1).map((r) => r).join()

            if (member.roles.cache.has(rol)) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Lo siento ${member} ya te has verificado como miembro de la comunidad!`)
                    ]
                })

            } else {

                await member.roles.add(datos.roles)

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`✅ | Verificado con éxito en el servidor!`)
                    ]
                })
            }

        }).catch((error) => {

            if (error) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Lo siento ${member} ocurrió un error con el botón!`)
                    ]
                })
            }
        })
    }
}