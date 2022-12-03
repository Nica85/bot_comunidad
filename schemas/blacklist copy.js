const { model, Schema } = require('mongoose');

module.exports = model('blacklist', new Schema({

    Servidores: [
        {
            servername: String,
            serverid: String,
            razon: String,
            tiempo: Number,
        },
    ],
    Usuarios: [
        {
            username: String,
            userid: String,
            razon: String,
            tiempo: Number,
        },
    ],

}))