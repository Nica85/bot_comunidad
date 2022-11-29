const { CommandInteraction, Client, InteractionType, EmbedBuilder } = require('discord.js');
const { ApplicationCommand } = InteractionType
const blacklistdb = require('../../schemas/blacklist');
const config = require('../../botconfig/config.json');
const ms = require('ms');

module.exports = {
    name: 'interactionCreate',

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction
        if (!guild || user.bot) return
        if (type !== ApplicationCommand) return

        let blacklist = await blacklistdb.findOne().catch((error) => { })

        const command = client.commands.get(commandName)

        if (!command) {

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('⚠ | Ocurrió un error al ejecutar el comando')
                ],
                ephemeral: true
            })
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        if (blacklist) {

            const usuario = blacklist.Usuarios.find((u) => u.userid === user.id)
            if (usuario) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle('Lista negra de usuarios')
                            .setDescription(`⚠ | Lo siento ${user} has sido agregado a la lista negra!\n\n*Tiempo:* <t:${parseInt(usuario.tiempo / 1000)}:R>\n*Razón:* \`${usuario.razon}\`\n*Si esto es un error puedes contactar con [Nica]#1752*`)
                    ],
                    ephemeral: true
                })
            }

            const servidor = blacklist.Servidores.find((s) => s.serverid === guild.id)
            if (servidor) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle('Lista negra de servidores')
                            .setDescription(`⚠ | Lo siento ${user} tu servidor a sido agregado a la lista negra!\n\n*Tiempo:* <t:${parseInt(servidor.tiempo / 1000)}:R>\n*Razón:* \`${servidor.razon}\`\n*Si esto es un error puedes contactar con [Nica]#1752*`)
                    ],
                    ephemeral: true
                })
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (command.owner) {

            if (user.id !== config.owners.nicaId) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Lo siento ${user} este comando solo puede ser utilizado por [Nica]#1752`)
                    ],
                    ephemeral: true
                })
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        if (command.UserPerms && command.UserPerms.length !== 0) {

            if (!member.permissions.has(command.UserPerms)) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Necesitas \`${command.UserPerms.join(', ')}\` para ejecutar este comando`)
                    ],
                    ephemeral: true
                })

            }
        }

        if (command.BotPerms && command.BotPerms.length !== 0) {

            if (!member.permissions.has(command.BotPerms)) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`⚠ | Necesito \`${command.BotPerms.join(', ')}\` para ejecutar este comando`)
                    ],
                    ephemeral: true
                })

            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const tiempo = client.timeout.get(`${user.id}_${command.name}`) || 0
        if(Date.now() - tiempo < 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`⚠ | Lo siento ${user} tienes que esperar ${ms(tiempo - Date.now(), { till: 'segundos' })} para ejecutar el comando!`)
                ],
                ephemeral: true
            })
        }

        client.timeout.set(`${user.id}_${command.name}`, Date.now() + (command.timeout || 0))
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        command.execute(interaction, client)
    }
}