const { Client, EmbedBuilder } = require('discord.js');
require('colors');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle('⚠ | Error Encontrado')
        .setTimestamp()

    process.on('unhandledRejection', (reason, p) => {

        console.log(' [SISTEMA] ::\n'.bgRed, reason, p)

        const canal = client.channels.cache.get('1043491314479677440')
        if (!canal) return

        canal.send({
            embeds: [
                embed.setDescription('**unhandled Rejection/Catch:\n\n** ```' + reason + '```')
            ]
        })
    })

    process.on('uncaughtException', (err, origin) => {

        console.log(' [SISTEMA] ::\n'.bgRed, err, origin)

        const canal = client.channels.cache.get('1043491314479677440')
        if (!canal) return

        canal.send({
            embeds: [
                embed.setDescription('**uncaught Exception/Catch:\n\n** ```' + err + '\n\n' + origin.toString() + '```')
            ]
        })
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {

        console.log(' [SISTEMA] ::\n'.bgRed, err, origin)

        const canal = client.channels.cache.get('1043491314479677440')
        if (!canal) return

        canal.send({
            embeds: [
                embed.setDescription('**uncaught Exception/Catch (MONITOR):\n\n** ```' + err + '\n\n' + origin.toString() + '```')
            ]
        })
    })

    //process.on('multipleResolves', () => { })

}