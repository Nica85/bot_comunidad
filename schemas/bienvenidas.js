const { model, Schema } = require('mongoose');

module.exports = model('bienvenida', new Schema({

    servername: String,
    serverid: String,
    canalname: String,
    canalid: String,
    rolname: String,
    rolid: String,
    contenido: {

        type: String,
        default: '{user} bienvenid@ a **{server}**'
    },
    mensaje: {

        type: String,
        default: 'Bienvenid@ {user} a nuestro servidor **{server}!**\n\nContigo ahora somo {members} usuarios!'
    },
    imagen: {

        type: String,
        default: 'https://i.imgur.com/E6wFwAt.png'
    }

}))