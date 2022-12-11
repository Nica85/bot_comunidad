const { model, Schema } = require('mongoose');

module.exports = model('logs', new Schema({

    servername: String,
    serverid: String,
    canalname: String,
    canalid: String,
    ban: { type: Boolean, default: false },
    unban: { type: Boolean, default: false },
    kick: { type: Boolean, default: false }

}))