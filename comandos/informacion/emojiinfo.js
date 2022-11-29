const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'emoji-info',
    description: 'obtén información sobre un emoji',
    category: 'información',
    options: [
        {
            name: 'emoji',
            description: 'proporciona un emoji personalizado del servidor',
            type: 3,
            required: true,
        },
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, options } = interaction

        await interaction.deferReply({ ephemeral: true })

        const emoji = options.getString('emoji')
        const regex = emoji.replace(/^<a?:\w+:(\d+)>$/, '$1')
        const emojis = guild.emojis.cache.find((emj) => emj.name === emoji || emj.id === regex)

        if (!emojis) {

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`⚠ | Lo siento ${user} tienes que proporcionar un emoji del servidor valido!`)
                ]
            })

        } else {

            await emojis.fetchAuthor().then((autor) => {

                const comprobar = (bool) => bool ? 'Si' : 'No'
                const uso = (bool) => bool ? `\`<a:${emojis.name}:${emojis.id}>\`` : `\`<:${emojis.name}:${emojis.id}>\``

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`Información de ${emojis.name}`)
                    .setThumbnail(`${emojis.url}`)
                    .addFields(
                        [
                            {
                                name: 'Información General',
                                value: `***Nombre:*** \`${emojis.name}\`\n***ID:*** \`${emojis.id}\`\n***Autor:*** \`${autor.tag}\`\n***Author ID:*** \`[${autor.id}]\`\n***Creado:*** \`${moment(emojis.createdTimestamp).format('LT')} ${moment(emojis.createdTimestamp).format('LL')} ${moment(emojis.createdTimestamp).fromNow()}\`\n***Accesible por:*** \`${emojis.roles.cache.map((rol) => rol.name).join(', ') || 'Todos'}\`\n***Url:*** [Link](${emojis.url})`,
                                inline: false
                            },
                            {
                                name: 'Otra información',
                                value: `***Requiere dos puntos:*** \`${comprobar(emojis.requiresColons)}\`\n***Eliminable:*** \`${comprobar(emojis.deletable)}\`\n***Animado:*** \`${comprobar(emojis.animated)}\`\n***Gestionado:*** \`${comprobar(emojis.managed)}\``,
                                inline: false
                            },
                            {
                                name: 'Uso',
                                value: `${uso(emojis.animated)}`,
                                inline: false
                            },
                        ]
                    )
                    .setFooter({ text: `Solicitado por: ${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                    .setTimestamp()

                return interaction.editReply({ embeds: [embed] })

            }).catch(async (error) => {

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

}