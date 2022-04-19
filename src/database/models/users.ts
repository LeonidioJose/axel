import mongoose from 'mongoose'

let schma = new mongoose.Schema({
    _id: String,
    money: {
        type: Number,
        default: 300
    },
    hasPremium: {
        type: Boolean,
        default: false
    },
    timePremium: {
        type: Number,
        default: 0
    },
    onAfk: {
        type: Boolean,
        default: false
    },
    typePremium: {
        type: String,
        default: "None"
    },
    afkReason: {
        type: String,
        default: "AFK"
    },
    badges: {
        type: Array,
        default: []
    },
    biography: {
        type: String,
        default: "undefined"
    },
    commandsExec: {
        type: Number,
        default: 0
    },
    blacklisted: {
        type: Boolean,
        default:  false
    }
})

export default {
    schema: schma,
    model: mongoose.model("Users",schma)
}