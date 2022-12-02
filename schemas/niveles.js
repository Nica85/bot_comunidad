const { model, Schema } = require('mongoose');

module.exports = model('niveles', new Schema({

    servername: String,
    serverid: String,
    canalname: String,
    canalid: String,
    imagen: { type: String, default: 'https://i.imgur.com/B963rmi.png' },
    usuarios: [{

        username: String,
        userid: String,
        xp: Number,
        nivel: Number,
        rolname: String,
        rolid: String

    }],
    recompensas: [{

        nivel: Number,
        rolname: String,
        rolid: String

    }],
    activado: Boolean

}))