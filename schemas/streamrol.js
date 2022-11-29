const { model, Schema } = require('mongoose');

module.exports = model('streamrol', new Schema({

    serverName: String,
    serverId: String,
    rolname: String,
    rolId: String

}))