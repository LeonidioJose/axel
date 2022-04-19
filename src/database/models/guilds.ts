import mongoose from 'mongoose'

let schea = new mongoose.Schema({
    _id: String,
    prefix: {
        type: String,
        default: "a?",
        required: false
    },
    logsChannel: {
        type: String,
        default: "None",
        required: false
    },
    logsEvents: {
        type: Array,
        default: []
    },
    logsType: {
        type: String,
        default: "text"
    },
    lang: {
        type: String,
        default: "pt"
    },
    blockedBots: {
        type: Boolean,
        default: false    
    }
})

export default {
    schema: schea,
    model: mongoose.model("Guilds",schea)
}