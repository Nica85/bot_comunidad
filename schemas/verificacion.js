const { model, Schema } = require('mongoose');

module.exports = model('verificacion', new Schema({

    serverName: String,
    serverId: String,
    roles: [String],
    mensajeId: String,
    canalName: String,
    canalId: String

}))