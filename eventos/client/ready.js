const { Client } = require('discord.js');
const { loadcommands } = require('../../funciones/funcionesbot');
const { mongodb } = require('../../botconfig/config.json');
const mongoose = require('mongoose');
require('colors');

module.exports = {
    name: 'ready',
    once: true,

    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {

        loadcommands(client).then(() => {

            console.log(` [SISTEMA] :: Conectado como ${client.user.tag}`.blue)

        }).catch((error) => { })
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        if(!mongodb) return
        mongoose.connect(mongodb.uri, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => {

            console.log(' [MONGODB] :: Base de datos conectada'.blue)

        }).catch((error) => console.log(error))
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    }
}