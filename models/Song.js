const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const SongSchema = new mongoose.Schema({
    songName:{
        type:String,
        required:[true,'Please provide song name'],
        maxlength:50
    },
    author:{
        type:String,
        required:[true,'Please provide author'],
        maxlength:50
    },
    key:{
        type:String,
        required:[true,'Please provide key'],
        enum:['Ab','A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#']

    },
    firstChord:{
        type:String,
        enum:['Ab','A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#']
    },
    capo:{
        type:Number,
    },
    bpm:{
        type:Number,
    },
    system:{
        type:String,
        enum:['Letters','Notes']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Song',SongSchema)
