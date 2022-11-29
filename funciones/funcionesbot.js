const { Client } = require('discord.js');
const { Perms } = require('./permisos');
const { Events } = require('./eventos');
const { glob } = require('glob');
const { promisify } = require('util');
const pg = promisify(glob);
const ascii = require('ascii-table');
require('colors');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function loadfiles(dirName) {

    const file = await pg(`${process.cwd().replace(/\\/g, '/')}/${dirName}/**/*.js`)
    file.forEach((file) => delete require.cache[require.resolve(file)])

    return file
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {Client} client
 */
async function loadevents(client) {

    const table = new ascii().setHeading('Eventos', 'Estado', 'Problemas')

    await client.removeAllListeners()

    const eventsFiles = await loadfiles('eventos')

    eventsFiles.forEach((file) => {

        const event = require(file)

        if (!Events.includes(event.name) || !event.name) {

            const L = file.split('/')

            table.addRow(`${event.name || 'Falta'}`, `El nombre del evento no es valido o no éxiste: ${L[6] + `/` + L[7]}`)

            return
        }

        const execute = (...args) => event.execute(...args, client)
        client.events.set(event.name, execute)

        if (event.rest) {

            if (event.once) client.rest.once(event.name, execute)
            else client.rest.on(event.name, execute)

        } else {

            if (event.once) client.once(event.name, execute)
            else client.on(event.name, execute)

        }

        table.addRow(event.name, '✅', 'Sin problemas')
    })

    console.log(table.toString(), '\n [SISTEMA] :: Eventos cargados'.blue)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {Client} client
 */
async function loadcommands(client) {

    const table = new ascii().setHeading('Comandos', 'Estado', 'Problemas')

    await client.commands.clear()

    let commandsArray = []

    const commandsFiles = await loadfiles('comandos')

    commandsFiles.forEach((file) => {

        const command = require(file)

        if (!command.name) return table.addRow(`${file}`.split('/')[7], '⚠', 'Sin nombre')
        if (!command.context && !command.description) return table.addRow(command.name, '⚠', 'Sin descripción')
        if (command.UserPerms)
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return table.addRow(command.name, '⚠', 'Permisos de usuario invalidos')

        client.commands.set(command.name, command)
        commandsArray.push(command)

        table.addRow(command.name, '✅', 'Sin problemas')
    })

    client.application.commands.set(commandsArray)

    console.log(table.toString(), '\n [SISTEMA] :: Comandos cargados'.blue)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param {Client} client
 */
async function loadhandlers(client) {

    const table = new ascii().setHeading('Handlers', 'Estado', 'Problemas')

    const handlersFiles = await loadfiles('handlers')

    handlersFiles.forEach((file) => {

        require(file)(client)

        table.addRow(`${handlersFiles.length}`, '✅', 'Sin problemas')
    })

    console.log(table.toString(), '\n [SISTEMA] :: Handlers cargados'.blue)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {

    loadevents,
    loadcommands,
    loadhandlers
}