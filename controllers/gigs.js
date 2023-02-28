const Gig = require('../models/Gig')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllGigs = async (req,res) =>{
    const gigs = await Gig.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({gigs, count:gigs.length})
}

const getGig = async (req,res) =>{
    const {user:{userId}, params:{id:gigId}} = req
    const gig = await Gig.findOne({_id:gigId, createdBy:userId})
    if(!gig) throw new NotFoundError (`No gig with id ${gigId}`)
    res.status(StatusCodes.OK).json({gig})
}

const createGig = async (req,res) => {
    req.body.createdBy = req.user.userId
    const gig = await Gig.create(req.body)
    res.status(StatusCodes.CREATED).json({gig})
}

const updateGig = async (req,res) => {
    const {body: {gigName}, user:{userId}, params:{id:gigId}} = req
    if(!gigName) throw new BadRequestError ('Provide a name for the gig')
    const gig = await Gig.findOneAndUpdate({_id:gigId, createdBy:userId}, req.body,{new:true, runValidators:true})
    if(!gig) throw new NotFoundError (`No gig with id${gigId}`)
    res.status(StatusCodes.OK).json({gig})
}

const deleteGig =  async (req,res) => {
    const {user:{userId}, params:{id:gigId}} = req
    const gig = await Gig.findOneAndRemove({_id:gigId, createdBy:userId})
    if(!gig) throw new NotFoundError(`No gig with id ${gigId}`)
    res.status(StatusCodes.OK).json({msg:`Gig "${gig.gigName}" deleted`}) 
}

module.exports = {
    getAllGigs,
    getGig,
    createGig,
    updateGig,
    deleteGig
}