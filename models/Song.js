const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { array, link, string } = require('joi')

const SongSchema = new mongoose.Schema({
    songName:{
        type:String,
        required:[true,'Please provide song name'],
        maxlength:50
    },    
    chords:{
        type:String,
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
        default: 'C',
        enum:['Ab','A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#']
    },
    capo:{
        type:Number,
        default: ' ',
    },
    bpm:{
        type:Number,
        default: '0',
    },
    system:{
        type:String,
        default: 'Letters',
        enum:['Letters','Notes']
    },
    link:{
        type: String
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user']
    },
    gigs:[mongoose.Types.ObjectId]
},{timestamps:true})

module.exports = mongoose.model('Song',SongSchema)
