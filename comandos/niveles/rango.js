const { ChatInputCommandInteraction, Client, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const nivelesdb = require('../../schemas/niveles');

module.exports = {
    name: 'rango',
    description: 'obtener el rango del servidor',
    category: 'niveles',
    options: [
        {
            name: 'usuario',
            description: 'ver tu rango o el de otro usuario',
            type: 6,
            required: false,
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, options } = interaction

        const usuario = options.getMember('usuario') || user

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

                const users = datos.usuarios.find((u) => u.userid === usuario.id)

                if (!users) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`⚠ | Lo siento ${user} el usuario no éxite en mi base de datos!`)
                        ],
                        ephemeral: true
                    })
                }

                try {

                    await interaction.deferReply()

                    const requerido = users.nivel * users.nivel * 100 + 100

                    const rango = new canvacord.Rank()
                        .setAvatar(`${usuario.displayAvatarURL()}`)
                        .setBackground('IMAGE', `${datos.imagen}`)
                        .setCurrentXP(users.xp)
                        .setRequiredXP(requerido)
                        .setRank(1, 'Rango#', true)
                        .setLevel(users.nivel, 'Nivel', true)
                        .setProgressBar('#5bece1', 'COLOR', true)
                        .setUsername(`${usuario.username}`)
                        .setDiscriminator(`${usuario.discriminator}`)

                    const tarjeta = await rango.build()

                    const attachment = new AttachmentBuilder(tarjeta, { name: 'rangonivel.png' })

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setImage('attachment://rangonivel.png')

                    return interaction.editReply({ embeds: [embed], files: [attachment] })

                } catch (error) {

                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`⚠ | Lo siento ${user} ocurrió un error al enviar la tarjeta de rango!`)
                        ]
                    })
                }
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