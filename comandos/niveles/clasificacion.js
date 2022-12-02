const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const nivelesdb = require('../../schemas/niveles');

module.exports = {
    name: 'clasificacion',
    description: 'mostrar la tabla de clasificaciones del servidor',
    category: 'niveles',

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild } = interaction

        await nivelesdb.findOne({ serverid: guild.id }).then(async (datos) => {

            if (!datos) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Lo siento ${user} no tengo datos en mi base de datos!`)
                    ],
                    ephemeral: true
                })

            } else {

                let index = 1
                let tabla = datos.usuarios.slice(0, 10).map((u) => {

                    return `${index++}. ${u.username} - Nivel: ${u.nivel} - Xp: ${u.xp}`

                }).join('\n')

                if (!tabla) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`⚠ | Lo siento ${user} no tengo suficientes datos para crear la tabla!`)
                        ],
                        ephemeral: true
                    })
                }

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Sistema de Nieles ${guild.name.toUpperCase()}`)
                    .setDescription(`**Top 10 de ${guild.name}**\n\`\`\`${tabla}\`\`\``)
                    .setFooter({ text: `Solicitado por ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                    .setTimestamp()
                if (guild.iconURL) embed.setThumbnail(`${guild.iconURL({ size: 512 })}`)

                return interaction.reply({ embeds: [embed] })
            }

        }).catch((error) => {

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠ | Lo siento ${user} ocurrió un error al ejecutar el comando!`)
                ],
                ephemeral: true
            })
        })
    }
}