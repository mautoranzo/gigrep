const mongoose = require('mongoose')


const GigSchema = new mongoose.Schema({
    gigName:{
        type:String,
        required:[true,'Please provide gig name, also can be the date of your gig']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Gig',GigSchema)