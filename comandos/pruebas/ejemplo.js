const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
//const ms = require('ms'); solamente si necesitan usar el timeout o algun otro uso que puedan darle

module.exports = {
    name: 'ejemplo',
    description: 'comando de ejemplo',
    //UserPerms: [''], solamente si el usuario necesita permisos para ejecutar el comando
    //BotPerms: ['], solamente si el bot necesita permisos para ejecutar el comando
    caregory: 'pruebas',
    //owner: true, solamente si es un comando de dueño,
    //timeout: ms('el tiempo que quieran'), solamente si necesitan que el comando tenga un tiempo de espera

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { guild, user, member, options, channel } = interaction // o lo que necesiten

        try {


            //aquí su nuevo código




        } catch (error) {

            console.log(error)

            /*return interaction.reply({  //solamente si quieren que el bot retorne algún mensaje de error al usuario que ejecuto el comando
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('el mensaje que quieran')
                ],
                ephemeral: true
            })*/
        }
    }
}