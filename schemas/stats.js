const { model, Schema } = require('mongoose');

module.exports = model('stats', new Schema({

    servername: String,
    serverid: String,
    canaluser: {

        canalname: String,
        canalid: String,
        rolname: String,
        rolid: String,
        nombre: String
    },
    canalbot: {

        canalname: String,
        canalid: String,
        rolname: String,
        rolid: String,
        nombre: String
    }

}))