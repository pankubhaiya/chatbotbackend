const mongoose = require("mongoose")

const botSchema = mongoose.Schema({

    email: { type: String, require: true },
    botName: { type: String, require: true },

}, {
    versionKey: false
})

const botModel = mongoose.model("bot", botSchema)

module.exports = botModel